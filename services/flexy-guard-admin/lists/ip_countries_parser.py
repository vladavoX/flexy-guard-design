import csv
import model


def _convert_to_int(val):
    print(val)
    if not isinstance(val, str):
        return ''
    if val.isdigit():
        return int(val)
    else:
        return val


class IpCountriesParser:

    def parse(self, path):
        f = open(path, 'r')
        fs = f.read()
        csv_dicts = [{k: _convert_to_int(v) for k, v in row.items() if k} for row in csv.DictReader(
            fs.splitlines(), skipinitialspace=True, delimiter=';')]
        model.update_ip_list(csv_dicts)
