from contextlib import suppress
import lists.bin_countries_parser as bcp
import lists.ip_countries_parser as icp
import lists.identity_parser as idp
from lists.identity_fio_parser import IdentityFioParser

import os

class ListParser():

    def run(self, path):
        
        head, tail = os.path.split(path)
        parser_dic = {
            'bin_by_country.csv' :  bcp.BinCountriesParser,
            'ip_by_country.csv': icp.IpCountriesParser,
            'identity_numbers.csv': idp.IdentityParser,
            'identity_fio.csv': IdentityFioParser,
        }

        parser_dic[tail]().parse(path)


    

