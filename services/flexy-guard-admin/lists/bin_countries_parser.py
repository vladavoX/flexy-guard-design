import model

class BinCountriesParser():

    def parse(self, path):
        f = open(path, 'r')

        model.clear_bins()
        
        line_count = 0
        bin_chunk = []
        bin_chunk_size = 10000
        for line in f:
            line_count += 1
            l = line
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
        print("Parsing: %s" % path)