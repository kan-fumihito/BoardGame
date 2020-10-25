from websocket_server import WebsocketServer
import json
import sys
import time
import daemon

table = []
index_client = lambda tables, client : [client in table for table in tables].index(True)
index_opponent = lambda table, client : (table[index_client(table, client)].index(client) + 1) % 2

def client_left(client, server):# handle disconnect
    index = index_client(table, client)
    if 1 in table[index]:# first disconnect
        table[index].append(2)
        table[index].remove(client)
    elif 2 in table:# second disconnect
        table.pop(index)
    else:# error disconnect
        if len(table[index]) != 1:
            print("{}:disconnect".format(client['id']))
            server.send_message(table[index][0], "disconnect")
        else:
            table.pop(index)
 
        

def new_client(client, server):# new client connect
    table_len = list(map(len, table))
    if 1 in table_len:# there is waiting client
        index = table_len.index(1)
        table[index].append(client)
        for i in range(2):
            server.send_message(table[index][i], str(-1 + 2*i))
        
    else:# fast client or no waiting client
        table.append([client])


def message_recv(client, server, message):# receive movement
    print("{}:{}".format(client['id'],message))
    data = json.loads(message)
    index = index_client(table, client)
    index_opp = index_opponent(table, client)
    if data['vict'] != 0:
        table[index].append(1)
    server.send_message(table[index][index_opp], message)        
        

def main():
    IP_ADDR = "192.168.0.4"
    PORT = 5775
    server = WebsocketServer(PORT, host=IP_ADDR)
    server.set_fn_new_client(new_client)
    server.set_fn_client_left(client_left)
    server.set_fn_message_received(message_recv)
    server.run_forever()

dc = daemon.DaemonContext(stderr=open('err_log.txt', 'w+'), stdout=open('output_log.txt', 'w+'))
with dc:
    main()
