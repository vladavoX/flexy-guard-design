import model

class IdentityParser():

    def parse(self, path):
        f = open(path, 'r')

        model.clear_ids()
        
        line_count = 0
        id_chunk = []
        id_chunk_size = 10000
        for line in f:
            line_count += 1
            l = line
            id_items_arr = l.split(',')
            id_items_dict = {
                "identity": "".join(id_items_arr).rstrip("\n")
            }
            id_chunk.append(id_items_dict)
                    
            print(id_items_dict)
            print(line_count)

            if len(id_chunk) == id_chunk_size:
                model.update_id_list(id_chunk)
                id_chunk.clear()
                print("chunk is updated")
        
        model.update_id_list(id_chunk)
        id_chunk.clear()
        print("chunk is finalized")
        print("Parsing: %s" % path)