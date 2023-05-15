from flask import Flask, flash, redirect, render_template, request, session, abort
from flask_basicauth import BasicAuth
import model
import json
from dotenv import load_dotenv
import os
import csv
# import config as cfg
# from celery import Celery
# from lists.list_parser import ListParser

load_dotenv()

app = Flask(__name__, static_url_path='')

app.config['BASIC_AUTH_USERNAME'] = os.getenv('BASIC_AUTH_USERNAME')
app.config['BASIC_AUTH_PASSWORD'] = os.getenv('BASIC_AUTH_PASSWORD')
app.config['BASIC_AUTH_FORCE'] = True
# app.config['UPLOAD_FOLDER'] = cfg.LIST_PATH
# app.config['MAX_CONTENT_PATH'] = 'lists/uploads/'
# app.config['CELERY_BROKER_URL'] = os.getenv('REDIS_URL')
# app.config['CELERY_RESULT_BACKEND'] = os.getenv('REDIS_URL')

basic_auth = BasicAuth(app)

# celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
# celery.conf.update(app.config)

@app.route("/")
def index():
    text=''
    rlist = model.get_rules(text)
    tpls = model.get_templates()
    return render_template('index.html', rlist=rlist, tlist=tpls)

@app.route("/add", methods=['POST'])
def add():
    res = model.add_rule(request.form["comment"], request.form["rule_json"])
    return json.dumps(res)

@app.route("/edit", methods=['GET'])
@app.route("/edit/<hash>", methods=['GET'])
def edit(hash):

    rule = model.get_rule_by_hash(hash)
    constants = model.get_all_constants()
    const_list = {}

    for const in constants:
        const_list[const['Type']].append(const)

    res = None

    if rule:
        res = {
            'Hash': '%s' % rule.Hash,
            'HashDescr': rule.HashDescr,
            'Comment': rule.Comment,
            'Rule': '%s' % json.dumps({'header': rule.Header, 'body': rule.Body, 'routing': rule.Routing})
        }
    else:
        return render_template('rules/404.html'), 404

    return render_template('index.html', edit=res, const_list=const_list)

@app.route("/update", methods=['POST'])
def update():
    if (request.form["action"] == 'update'):
        res = model.update_rule(request.form["hash"], request.form["comment"], request.form["rule_json"])
        return json.dumps(res)
    elif (request.form["action"] == 'remove'):
        res = model.delete_rule(request.form["hash"])
        return json.dumps(res)

@app.route("/list", methods=['GET'])
@app.route("/list/", methods=['GET'])
@app.route("/list/<text>", methods=['GET'])
def rlist(text=''):
    rlist = model.get_rules(text)
    tpls = model.get_templates()
    return render_template('rlist.html', rlist=rlist, tlist=tpls)

@app.route("/search", methods=['POST'])
def search():
    return redirect('/list/%s' % request.form['text'], code=302)

@app.route('/rules/new', methods=['GET'])
def new_rule():
    return render_template('rules/new.html')

@app.route('/rules/<hash>', methods=['GET'])
def get_rule(hash):
    rule = model.get_template_by_hash(hash)

    if rule:
        res = {
            'Hash': '%s' % rule.Hash,
            'HashDescr': rule.HashDescr,
            'Comment': rule.Comment,
            'Rule': '%s' % json.dumps({'header': rule.Header, 'body': rule.Body, 'routing': rule.Routing})
        }
    else:
        return json.dumps({'message': 'Requested template was not found'}), 404

    return json.dumps(res)

@app.route('/rules/edit/<id>', methods=['GET'])
def edit_rule(id):
    rule = model.get_rule_by_hash(id)

    if rule is None:
        return render_template('rules/404.html'), 404

    header = rule.Header
    body = rule.Body

    card = {
        'daily': rule.Body.get('card', {}).get('amount', {}).get('sum', {}).get('1', [None, None]),
        'weekly': rule.Body.get('card', {}).get('amount', {}).get('sum', {}).get('7', [None, None]),
        'monthly': rule.Body.get('card', {}).get('amount', {}).get('sum', {}).get('30', [None, None]),
        'yearly': rule.Body.get('card', {}).get('amount', {}).get('sum', {}).get('365', [None, None]),
        'is_sum': rule.Body.get('card', {}).get('amount', {}).get('sum', None),
        'amount': rule.Body.get('card', {}).get('amount', {}).get('value', [None, None]),
        'count': rule.Body.get('card', {}).get('count', {}).get('1', [None, None]),
        'status': rule.Body.get('card', {}).get('status', {}).get('count', {}).get('1#approved', [None, None]),
    }

    rule.create_available_routing()

    available_routing = rule.available_routing
    routing = {}

    if rule.Routing is not None:
        for route_key, route_item in rule.Routing.items():
            routing[route_key] = route_item['acq_alias']

    gateways = model.get_constants('gw_alias')
    mids = model.get_constants('mid')

    mid_list = {}
    if mids:
        for mid_item in mids:
            mid_keys = mid_item.Value.split('-')
            mid_list[mid_keys[0].strip()] = mid_item.Value

    constants = model.get_all_constants()
    const_list = {}

    for const in constants:
        if const.Type not in const_list:
            const_list[const.Type] = []

        const_list[const.Type].append(const.Value)


    json = {
        'header': header,
        'body': body,
        'routing': routing
    }

    return render_template(
        'rules/edit.html',
        json=json,
        rule=rule,
        card=card,
        routing=routing,
        const_list=const_list,
        available_routing=available_routing,
        gateways=gateways,
        mid_list=mid_list
    )

@app.route("/rules/advanced", methods=['GET'])
def advanced_add():
    json = '{ "header": { "mid": "123", "acq_id": "1234", "currency": "USD" }, "body": { "card": { "count": { "1": [0,70], "7": [0, 1500] }, "amount": { "sum": { "1": [0, 300000], "30": [0, 500000] }, "value": [10, 10000] }, "not_in": ["sadsadasdasdasdasdas", "asdasdasd"], "in": ["qwerty"] }, "bin": { "not_in_country": ["US", "CA"] } } }'
    return render_template('rules/advanced.html', default=json)

@app.route("/rules/advanced/<hash>", methods=['GET'])
def advanced(hash):
    rule = model.get_rule_by_hash(hash)
    res = {'Hash': '%s' % rule.Hash, 'HashDescr': rule.HashDescr, 'Comment': rule.Comment,
           'Rule': '%s' % json.dumps({'header': rule.Header, 'body': rule.Body, 'routing': rule.Routing})}

    return render_template('rules/advanced.html', edit=res)

@app.route('/rules/update/<id>', methods=['POST'])
def update_rule(id):
    rule = {
        "header": {
            "currency": request.form['currency'],
            "to_profile": request.form['to_profile'],
            "type": request.form['operation'],
            "source": request.form['source']
        },
        "body": {
            "self": {
                "rate": request.form['self_rate'],
                "fee": request.form['self_fee'],
                "min": request.form['self_min']
            },
            "provider": {
                "rate": request.form['provider_rate'],
                "fee": request.form['provider_fee'],
                "min": request.form['provider_min']
            }
        }
    }

    if rule['header']['currency'] is None or rule['header']['currency'] == '':
        del rule['header']['currency']
    else:
        rule['header']['currency'] = rule['header']['currency'].upper()

    if rule['header']['to_profile'] is None or rule['header']['to_profile'] == '':
        del rule['header']['to_profile']

    if rule['header']['source'] is None or rule['header']['source'] == '':
        del rule['header']['source']

    if rule['body']['provider']['fee'] is None or rule['body']['provider']['fee'] == '':
        del rule['body']['provider']['fee']

    if rule['body']['provider']['min'] is None or rule['body']['provider']['min'] == '':
        del rule['body']['provider']['min']

    if rule['body']['self']['fee'] is None or rule['body']['self']['fee'] == '':
        del rule['body']['self']['fee']

    if rule['body']['self']['min'] is None or rule['body']['self']['min'] == '':
        del rule['body']['self']['min']

    comment = request.form['comment']
    res = model.update_rule(id, comment, json.dumps(rule))
    return redirect(url_for('rlist'))

@app.route('/templates', methods=['GET'])
@app.route('/templates/', methods=['GET'])
def templates():
    rlist = model.get_templates()
    return render_template('templates.html', rlist=rlist)

@app.route('/templates/new', methods=['GET'])
@app.route('/templates/<id>', methods=['GET'])
def new_template(id = None):
    res = None
    default = '{}'

    if id is not None:
        rule = model.get_template_by_hash(id)

        if rule is None:
            return render_template('templates/404.html'), 404

        res = {
            'Hash': '%s' % rule.Hash,
            'HashDescr': rule.HashDescr,
            'Comment': rule.Comment,
            'Rule': '%s' % json.dumps({'header': rule.Header, 'body': rule.Body, 'routing': rule.Routing})
        }

    return render_template('templates/edit.html', edit=res, default=default)

@app.route("/templates", methods=['POST'])
def add_template():
    res = model.add_template(request.form["comment"], request.form["template"])
    return json.dumps(res)

@app.route("/templates/<hash>", methods=['PATCH', 'PUT'])
def update_template(hash):
    res = model.update_template(hash, request.form["comment"], request.form["template"])
    return json.dumps(res)

@app.route("/templates/<hash>", methods=['DELETE'])
def delete_template(hash):
    res = model.delete_template(hash)
    return json.dumps(res)

# CONSTANTS
@app.route('/constants/<type>/new', methods=['GET'])
@app.route('/constants/<type>/<id>', methods=['GET'])
def new_constant(type, id = None):
    res = None

    if id is not None:
        const = model.get_constant_by_hash(id)

        if const is None:
            return render_template('constants/404.html'), 404

        res = {
            'Hash': '%s' % const.Hash,
            'Type': const.Type,
            'Value': const.Value,
        }

    types_list = {
        'mid': 'Merchant ID',
        'currency': 'Gateway Currency',
        'gw_alias': 'Gateway Alias',
        'gw_type': 'Gateway Type'
    }

    return render_template('constants/edit.html', edit=res, type=type, types_list=types_list)

@app.route("/constants/<type>", methods=['GET'])
def get_constants(type):
    list = model.get_constants(type)

    types_list = {
        'mid': 'Merchant ID',
        'currency': 'Gateway Currency',
        'gw_alias': 'Gateway Alias',
        'gw_type': 'Gateway Type'
    }

    return render_template('constants.html', list=list, type=type, types_list=types_list)

@app.route("/constants/<type>", methods=['POST'])
def add_constant(type):
    res = model.add_constant(type, request.form["value"])
    return json.dumps(res)

@app.route("/constants/<type>/<hash>", methods=['PATCH', 'PUT'])
def update_constant(type, hash):
    res = model.update_constant(hash, type, request.form['value'])
    return json.dumps(res)

@app.route("/constants/<type>/<hash>", methods=['DELETE'])
def delete_constant(type, hash):
    res = model.delete_constant(type, hash)
    return json.dumps(res)

@app.route('/definitions', methods=['GET', 'POST'])
def defintions():
    val = None

    if (request.method == 'GET'):
        de = model.get_definition()
        if (de):
            val = de.Value
    elif (request.method == 'POST'):
        value = request.form["rule_json"]
        de = model.update_def(value)
        val = de.Value

    return render_template('definitions.html', definition=val)
def _convert_to_int(val):
    print(val)
    if not isinstance(val, str):
        return ''
    if val.isdigit():
        return int(val)
    else:
        return val

@app.route('/lists', methods=['GET', 'POST'])
def upload_lists():

    if (request.method == 'POST'):
        f = request.files['ip_countries'] 
        if f: 
            fs = f.read().decode('utf-8')
            csv_dicts = [{k: _convert_to_int(v) for k, v in row.items() if k} for row in csv.DictReader(
                    fs.splitlines(), skipinitialspace=True, delimiter=';')]
            model.update_ip_list(csv_dicts)

# need 2 wrap it with a private func
        
        f = request.files['bin_countries']
        if f:
            process_bin_countries(f)
            # fs = f.read().decode('utf-8')
            # csv_dicts = [{k: _convert_to_int(v) for k, v in row.items() if k} for row in csv.DictReader(
            # fs.splitlines(), skipinitialspace=True, delimiter=';')]
            # print(csv_dicts)
            # print('Updating mongo')
            # model.update_bin_list(csv_dicts)
    
    return render_template('lists.html')

@app.route('/history', methods=['GET'])
@app.route('/history/<text>', methods=['GET'])
def history(text=''):
    rlist = model.get_history(text)
    return render_template('history.html', rlist=rlist)

@app.route("/history_search", methods=['POST'])
def history_search():
    return redirect('/history/%s' % request.form['text'], code=302)

@app.route("/dashboard", methods=['GET'])
def dashboard():
    return render_template('dashboard.html', dashboard=dashboard)

def process_bin_countries(f):
        model.clear_bins()
        line_count = 0
        bin_chunk = []
        bin_chunk_size = 10000
        for line in f:
            line_count += 1
            l = line.decode('utf-8')
            bin_items_arr = l.split(';')
            if bin_items_arr[0].isdigit():
                bit_items_dict = {
                    "bin": int(bin_items_arr[0]),
                    "ps": bin_items_arr[1],
                    "bank_name": bin_items_arr[2],
                    "type": bin_items_arr[3],
                    "sub_type": bin_items_arr[4],
                    "country": bin_items_arr[5],
                    "ccode_short": bin_items_arr[6],
                    "ccode_iso": bin_items_arr[7],
                    "code": bin_items_arr[8],
                    "www": bin_items_arr[9]
                }
                bin_chunk.append(bit_items_dict)
                
                print(bit_items_dict)
                print(line_count)

                if len(bin_chunk) == bin_chunk_size:
                    model.update_bin_list(bin_chunk)
                    bin_chunk.clear()
                    print("chunk is updated")
        
        model.update_bin_list(bin_chunk)
        bin_chunk.clear()
        print("chunk is finalized")


# @celery.task
# def parse_file(file):
#     parser = ListParser()
#     parser.run(file)


if __name__ == '__main__':
    app.run(host=os.getenv('SERVER_HOST'),
            port=os.getenv('SERVER_PORT'),
            debug=os.getenv('SERVER_DEBUG'))
    print("APP NAME:%s" % app.name)
