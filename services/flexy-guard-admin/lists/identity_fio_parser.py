import model

class IdentityFioParser:
    def parse(self, path):
        f = open(path, 'r')

        model.clear_fio()
        model.add_fio_full_text_index()

        line_count = 0
        id_chunk = []
        id_chunk_size = 10000
        for line in f:
            line_count += 1
            l = line
            id_items_arr = l.split(',')
            id_items_dict = {
                "fio": id_items_arr[0].split(';')[0].lower()
            }
            id_chunk.append(id_items_dict)
                    
            print(id_items_dict)
            print(line_count)

            if len(id_chunk) == id_chunk_size:
                model.update_fio_list(id_chunk)
                id_chunk.clear()
                print("chunk is updated")
        
        model.update_fio_list(id_chunk)
        id_chunk.clear()
        print("chunk is finalized")
        print("Parsing: %s" % path)