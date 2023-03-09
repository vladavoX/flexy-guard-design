
from pymongo import MongoClient
import hashlib
import config as cfg
import json
import datetime

CN = cfg.DB_CONNECTION
client = MongoClient(CN, serverSelectionTimeoutMS=5000000)
db = client['counters']

class RuleListItem():
    Hash = '',
    HashDescr = '',
    Comment = '',
    CreatedAt = ''

class Rule():
    Id = '',
    Hash = '',
    HashDescr = '',
    Header = '',
    Body = '',
    Routing = '',
    Comment = '',
    CreatedAt = '',
    IsDeleted = False

    available_routing = []

    def create_available_routing(self, arr = None, route_str = None):
        print(route_str)

        if arr is None:
            self.available_routing = []
            arr = self.Body

        for key, item in arr.items():
            str = route_str + ':' + key if route_str is not None else key
            if type(item) is not dict:
                self.available_routing.append(str)
            else:
                self.create_available_routing(item, str)

class Definition():
    Id = '',
    CreatedAt = '',
    Value = '',
    IsDeleted = False

class Template():
    Id = '',
    Hash = '',
    HashDescr = '',
    Header = '',
    Body = '',
    Routing = '',
    Comment = '',
    CreatedAt = '',
    IsDeleted = False

class Constant():
    Id = ''
    Type = ''
    Value = ''
    IsDeleted = False

def update_cache(func):
    def wrapper(*args, **kwargs):
        db['refresh'].drop()
        db['refresh'].insert_one({'date': datetime.datetime.utcnow()})
        return func(*args, **kwargs)
    return wrapper

def map_definition(dict):
    de = Definition()
    de.CreatedAt = dict["CreatedAt"]
    de.IsDeleted = dict["IsDeleted"]
    de.Value = dict["Value"]

    return de

def map_rule(dict):
    rule = Rule()
    rule.Id = dict["_id"]

    if 'CreatedAt' in dict:
        rule.CreatedAt = dict["CreatedAt"]

    rule.Header = dict["Header"]
    rule.Body = dict["Body"]
    rule.Comment = dict["Comment"]
    rule.Hash = dict["Hash"]
    rule.IsDeleted = dict["IsDeleted"]
    rule.HashDescr = dict["HashDescr"]
    rule.Routing = dict["Routing"] if "Routing" in dict else None

    return rule

def map_rulelistitem(dict):
    rule = RuleListItem()
    rule.Hash = dict["Hash"]
    rule.HashDescr = dict["HashDescr"]
    rule.Comment = dict["Comment"]
    rule.IsDeleted = dict["IsDeleted"]

    if 'CreatedAt' in dict and dict['CreatedAt']:
        rule.CreatedAt = "{:%B %d, %Y, at %H:%M}".format(dict["CreatedAt"])

    else:
        rule.CreatedAt = "—"

    if 'CreatedBy' in dict and dict['CreatedBy']:
        rule.CreatedBy = dict["CreatedBy"]
    else:
        rule.CreatedBy = "—"

    if 'UpdatedAt'in dict and dict['UpdatedAt']:
        rule.UpdatedAt = "{:%B %d, %Y, at %H:%M}".format(dict["UpdatedAt"])
    else:
        rule.UpdatedAt = "—"

    if 'UpdatedBy' in dict and['UpdatedBy']:
        rule.UpdatedBy = dict["UpdatedBy"]
    else:
        rule.UpdatedBy = "—"

    return rule

def get_rules_collection():
    return db['rules']

def get_def_collection():
    return db['definitions']

def get_tpl_collection():
    return db['templates']

def get_const_collection():
    return db['constants']

def get_ip_country_collection():
    return db['ip:countries']

def get_bin_country_collection():
    return db['bin:countries'] 

def _get_hash(header, body):
    s_keys_values = []

    s_keys_values.append(str(datetime.datetime.now()))

    for k, v in header.items():
        s_keys_values.append("'%s':'%s'" % (k, v))

    hash = hashlib.md5(','.join(s_keys_values).encode()).hexdigest()
    
    return hash

def get_rule_by_hash(hash, is_deleted = False):
    col = get_rules_collection()
    cur = col.find_one({'Hash': hash, 'IsDeleted': is_deleted})
    if cur:
        return map_rule(cur)
    return None

@update_cache
def add_rule(comment, json_string, replaced_hash = None):
    o_json = json.loads(json_string)
    hash = _get_hash(o_json['header'], o_json['body'])

    col = get_rules_collection()
    rule = get_rule_by_hash(hash)

    if (rule):
        print("Error: %s" % hash)
        return {'result': False, 'data': hash, 'message': 'Cannot add new rule, found existing rule with same header and body'}

    r = Rule()

    if replaced_hash is None:
        r.CreatedAt = datetime.datetime.utcnow()
        r.CreatedBy = None
    else:
        old_rule = get_rule_by_hash(replaced_hash, True)

        if hasattr(old_rule, 'CreatedAt'):
            r.CreatedAt = old_rule.CreatedAt

        if hasattr(old_rule, 'CreatedBy'):
            r.CreatedBy = old_rule.CreatedBy

        r.UpdatedAt = datetime.datetime.utcnow()
        r.UpdatedBy = None

    r.Hash = hash
    r.HashDescr = ','.join(["%s:%s" % (k, v) for k, v in o_json['header'].items()])
    r.Header =  o_json['header']
    r.Body = o_json['body']
    r.Routing = o_json['routing'] if "routing" in o_json else None
    r.Comment = comment
    r.IsDeleted = False

    _id = col.insert_one(r.__dict__).inserted_id

    print("Inserted rule: %s" % _id)

    return {'result': True, 'data': hash}

@update_cache
def delete_rule(hash):
    col = get_rules_collection()
    col.update_one({'Hash': hash, 'IsDeleted': False},
                   {'$set': {'IsDeleted': True}})

@update_cache
def update_rule(hash, comment, json_string):
    # rule = get_rule_by_hash(hash)
    # TODO: 409 Conflict response
    # if (rule):
    #     print("Error: %s" % hash)
    #     return {'result': False, 'data': hash, 'message': 'Can not save rule, found existing rule with same header and body'}

    delete_rule(hash)
    return add_rule(comment, json_string, hash)

def get_rules(text):
    col = get_rules_collection()
    cur = None

    if (text or len(text) > 0):
        cur = col.find({'$text': {'$search': text}, 'IsDeleted': False}).sort([('CreatedAt', -1)])
    else:
        cur = col.find({'IsDeleted': False}).sort([('CreatedAt', 1)])

    return [map_rulelistitem(cur_item) for cur_item in cur]

def get_history(text):
    col = get_rules_collection()
    cur = None

    if text or len(text) > 0:
        cur = col.find({'$search': text}).sort([('UpdatedAt', -1)])
    else:
        cur = col.find().sort([('CreatedAt', -1)])

    return [map_rulelistitem(cur_item) for cur_item in cur]

def get_definition():
    
    col = get_def_collection()
    cur = col.find_one({'IsDeleted': False})

    if (cur):
        return map_definition(cur)
    else:
        return cur

def get_template_by_hash(hash):
    col = get_tpl_collection()
    cur = col.find_one({'Hash': hash, 'IsDeleted': False})
    if cur:
        return map_rule(cur)
    return None

def get_templates():
    col = get_tpl_collection()
    cur = None

    cur = col.find({'IsDeleted': False}).sort([('CreatedAt', 1)])

    return [map_rulelistitem(cur_item) for cur_item in cur]

def add_template(comment, json_string, isNew = True):
    o_json = json.loads(json_string)
    hash = _get_hash(o_json['header'], o_json['body'])

    col = get_tpl_collection()

    r = Template()

    if isNew is True:
        r.CreatedAt = datetime.datetime.utcnow()
        r.CreatedBy = ''
    else:
        r.UpdatedAt = datetime.datetime.utcnow()
        r.UpdatedBy = ''

    r.Hash = hash
    r.HashDescr = ','.join(["%s:%s" % (k, v) for k, v in o_json['header'].items()])
    r.Header =  o_json['header']
    r.Body = o_json['body']
    r.Routing = o_json['routing'] if "routing" in o_json else None
    r.Comment = comment
    r.IsDeleted = False

    _id = col.insert_one(r.__dict__).inserted_id

    print("Inserted template: %s" % _id)

    return {'result': True, 'data': hash}

def delete_template(hash):
    col = get_tpl_collection()
    res = col.update_one({'Hash': hash, 'IsDeleted': False}, {'$set': {'IsDeleted': True}})

    print("Deleted template: %s" % col.upserted_id)

    return {'result': True, 'data': hash}

def update_template(hash, comment, json_string):
    tpl = get_template_by_hash(hash)

    delete_template(hash)
    return add_template(comment, json_string, False)

def map_constantitem(item):
    res = Constant()

    res.Hash = item['Hash']
    res.Type = item['Type']
    res.Value = item['Value']
    res.IsDeleted = item['IsDeleted']

    return res

def get_constant_by_hash(hash):
    col = get_const_collection()
    cur = col.find_one({'Hash': hash, 'IsDeleted': False})

    if cur:
        r = Constant()

        r.Hash = hash
        r.Type =  cur['Type']
        r.Value = cur['Value']
        r.IsDeleted = False

        return r

    return None

def get_all_constants():
    col = get_const_collection()
    cur = None

    cur = col.find({'IsDeleted': False}).sort([('CreatedAt', 1)])

    return [map_constantitem(cur_item) for cur_item in cur]

def get_constants(type):
    col = get_const_collection()
    cur = None

    cur = col.find({'Type': type, 'IsDeleted': False}).sort([('CreatedAt', 1)])

    return [map_constantitem(cur_item) for cur_item in cur]

def add_constant(type, value):
    str = type + ':' + value
    hash = hashlib.md5(str.encode()).hexdigest()

    col = get_const_collection()

    r = Constant()

    r.Hash = hash
    r.Type =  type
    r.Value = value
    r.IsDeleted = False

    _id = col.insert_one(r.__dict__).inserted_id

    print("Inserted contant: %s" % _id)

    return {'result': True, 'data': hash}

def delete_constant(type, hash):
    col = get_const_collection()
    res = col.update_one({'Hash': hash, 'IsDeleted': False}, {'$set': {'IsDeleted': True}})

    print("Deleted constant: %s" % col.upserted_id)

    return {'result': True, 'data': hash}

def update_constant(hash, type, value):
    delete_constant(type, hash)
    return add_constant(type, value)

@update_cache
def add_def(value):

    col = get_def_collection()

    de = Definition()
    de.CreatedAt = datetime.datetime.utcnow()
    de.Value = value
    de.IsDeleted = False

    _id = col.insert_one(de.__dict__).inserted_id

    return get_definition()

@update_cache
def delete_def():
    
    col = get_def_collection()
    col.update_one({'IsDeleted': False}, {'$set': {'IsDeleted': True}})

def update_def(value):

    delete_def()
    return add_def(value)

@update_cache
def update_ip_list(ip_list):

    col = get_ip_country_collection()
    col.delete_many({})
    col.insert_many(ip_list)

@update_cache
def clear_bins():
    col = get_bin_country_collection()
    col.delete_many({})

@update_cache
def update_bin_list(bin_list):
    col = get_bin_country_collection()
    col.insert_many(bin_list)

@update_cache
def update_id_list(number_passports):
    col = get_identity_list_collection()
    col.insert_many(number_passports)

@update_cache
def clear_ids():
    col = get_identity_list_collection()
    col.delete_many({})
