PRINT=print
print=lambda *x:None
ans=3
#TAG CSE310 Assignment 4
pcap_file_path='/Users/Ryan/Desktop/CleanCode/SBU/CSE310/Assignment4/arpdump.pcap'

import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    #data=dpkt.radiotap.Radiotap(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
#UNDO OFF
#TAG CSE310 Assignment 4
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    #data=dpkt.radiotap.Radiotap(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
del packets;del pcap
#TAG CSE310 Assignment 4
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    #data=dpkt.radiotap.Radiotap(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
try:del packets;del pcap
except:pass
#TAG CSE310 Assignment 4
#
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    #data=dpkt.radiotap.Radiotap(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
try:del packets;del pcap
except:pass
#TAG CSE310 Assignment 4
#
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    data=dpkt.ethernet.Ethernet(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
try:del packets;del pcap
except:pass
#TAG CSE310 Assignment 4
#
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    data=dpkt.ethernet.Ethernet(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
ans=packets[0]
ans=dpkt.arp.ARP
try:del packets;del pcap
except:pass
#TAG CSE310 Assignment 4
#
import dpkt
try:
    pcap_file;pcap
except:
    pcap_file=open(pcap_file_path,'rb')
    pcap=dpkt.pcap.Reader(pcap_file)
def packetify(pcap_entry):
    time,data=pcap_entry
    #data=dpkt.ethernet.Ethernet(data)
    #class c(bytes):pass
    #data=c(data)
    #data.time=time
    return data
try:packets
except:pcap_copy=[*pcap];packets=list(map(packetify,pcap_copy))
ans=dpkt.arp.ARP(packets[0])
ans=ans.data
ans=dpkt.icmp.ICMP(packets[0])
ans=dpkt.icmp.ICMP(packets[0])
ans=dpkt.icmp.ICMP(packets[3])
ans=dpkt.icmp.ICMP(packets[56])
ans=dpkt.icmp.ICMP(packets[99])
ans=dpkt.icmp.ICMP(packets[234])
ans=dpkt.icmp.ICMP(packets[865])
ans=dpkt.icmp.ICMP(packets[865])
ans=(packets[865])
def pretty_ip(bytestring):
    assert len(bytestring)==4
    return '.'.join([str(int(x))for x in bytestring])
ans=pretty_ip(ans[:4])
ans=b'\x3a'
ans=b'\x3a\x0d'
ans=b'\x3a\x0d' in  packets[0]
ans=b'\xc7\xb8' in  packets[0]
ans=b'\xe4\xc7\xb8' in  packets[0]
ans=b'\xe5\xc7\xb8' in  packets[0]
ans=b'\xe3\xc7\xb8' in  packets[0]
ans=b'\xe4\xc7\xb8' in  packets[0]
ans=packets[0].find(b'\xe4\xc7\xb8')
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0].find(b'\xe4\xc7\xb8')
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
ans=packets[0]
s=set()
for p in packets:
    s|={p[:6]}
ans=s
ans=list(ans)
display_list(ans)
ans=hex(234)
ans=hex(2341)
print(''.join('{:02x}'.format(x) for x in packets[0]))
print(''.join('{:02x}'.format(x) for x in packets[0]))
for p in s:
    print(''.join('{:02x}'.format(x) for x in p))

ans=len('01005e0000fc')
for p in sorted(s):
    print(''.join('{:02x}'.format(x) for x in p))

for p in packets:
    s|={p[6:6+6]}
s = set()
s=set()

for p in packets:
    s|={p[6:6+6]}
s=set()

for p in packets:
    s|={p[6:6+6]}
for p in sorted(s):
    print(''.join('{:02x}'.format(x) for x in p))


s=set()

for p in packets:
    s|={p[:6]}
for p in sorted(s):
    print(''.join('{:02x}'.format(x) for x in p))

s=set()

for p in packets:
    s|={p[6:6+6]}
for p in sorted(s):
    print(''.join('{:02x}'.format(x) for x in p))

ss=s
s=set()

for p in packets:
    s|={p[:6]}
for p in sorted(s):
    print(''.join('{:02x}'.format(x) for x in p))

ans=ss&s
for p in sorted(ans):
    print(''.join('{:02x}'.format(x) for x in p))
    
for p in sorted(ans):
    print(''.join('{:02x}'.format(x) for x in p))
for p in packets:
    print()
def hexx ():
    pass
def hexx(p):
    print(''.join('{:02x}'.format(x) for x in p))
for p in packets:
    print(hexx(p[12:14]))
for p in packets:
    print(hexx(p[12:14]))
def hexx(p):
    return(''.join('{:02x}'.format(x) for x in p))
for p in packets:
    print(hexx(p[12:14]))
def is_arp(p):
    return hexx(p[12:14])=='0806'
for p in packets:
    if is_arp(p):
        print(hexx(p))
def arps():
    for p in packets:
        if is_arp(p):
            dstmac=hexx(p[:6])
            srcmac=hexx(p[6:12])
            sendmac=hexx(p[16+6:16+12])
            sendip=pretty_ip(p[16+12:16+12+4])
            targmac=hexx(p[16+12+4:16+12+4+6])
            targip=pretty_ip(p[16+12+4+6:16+12+4+6+4])
            yield dict(dstmac=dstmac,srcmac=srcmac,sendmac=sendmac,sendip=sendip,targmac=targmac,targip=targip)
ans=arps()
ans=list(arps())
display_list(list(arps()))
pretty_print(list(arps()))
pretty_print(list(arps()),0)
pretty_print(list(arps()))
pretty_print(list(arps()))
l=list(arps())
ans=l
ans=l
#UNDO OFF
ans=l
ans=l
ans=l
targmacs=set(x['targmac']for x in l)
ans=targmacs
targmacs=sorted(set(x['targmac']for x in l))
ans=targmacs
targmacs=set(x['targmac']for x in l)

srcmacs=set(x['srcmac']for x in l)
sendmacs=set(x['sendmac']for x in l)
sendips=set(x['sendip']for x in l)
targmacs=set(x['targmac']for x in l)
targips=set(x['targip']for x in l)
ans=targips 
dstmacs=set(x['dstmac']for x in l)
srcmacs=set(x['srcmac']for x in l)
sendmacs=set(x['sendmac']for x in l)
sendips=set(x['sendip']for x in l)
targmacs=set(x['targmac']for x in l)
targips=set(x['targip']for x in l)
ans=targips
ans=targips & sendips
ans=targmacs & sendmacs & srcmacs &dstmacs
ans=l
ans=targmacs & sendmacs & srcmacs &dstmacs
devices= ans
#UNDO OFF
ans=packets[0][20:22]
ans=arps
ans=l
def arps():
    for p in packets:
        if is_arp(p):
            dstmac=hexx(p[:6])
            srcmac=hexx(p[6:12])
            sendmac=hexx(p[16+6:16+12])
            sendip=pretty_ip(p[16+12:16+12+4])
            targmac=hexx(p[16+12+4:16+12+4+6])
            targip=pretty_ip(p[16+12+4+6:16+12+4+6+4])
            opcode=p[20:22]
            opcode={1:'request',2:'reply'}[opcode]
            packet=p
            yield dict(packet=p,dstmac=dstmac,srcmac=srcmac,sendmac=sendmac,sendip=sendip,targmac=targmac,targip=targip)
l=arps()
ans=l
ans=int(ord('\x01'))
def arps():
    for p in packets:
        if is_arp(p):
            dstmac=hexx(p[:6])
            srcmac=hexx(p[6:12])
            sendmac=hexx(p[16+6:16+12])
            sendip=pretty_ip(p[16+12:16+12+4])
            targmac=hexx(p[16+12+4:16+12+4+6])
            targip=pretty_ip(p[16+12+4+6:16+12+4+6+4])
            opcode=p[20:22]
            opcode={1:'request',2:'reply'}[ord(opcode[-1])]
            packet=p
            yield dict(packet=p,dstmac=dstmac,srcmac=srcmac,sendmac=sendmac,sendip=sendip,targmac=targmac,targip=targip)
def arps():
    for p in packets:
        if is_arp(p):
            dstmac=hexx(p[:6])
            srcmac=hexx(p[6:12])
            sendmac=hexx(p[16+6:16+12])
            sendip=pretty_ip(p[16+12:16+12+4])
            targmac=hexx(p[16+12+4:16+12+4+6])
            targip=pretty_ip(p[16+12+4+6:16+12+4+6+4])
            opcode=p[20:22]
            opcode={1:'request',2:'reply'}[opcode[-1]]
            packet=p
            yield dict(packet=p,dstmac=dstmac,srcmac=srcmac,sendmac=sendmac,sendip=sendip,targmac=targmac,targip=targip)
l=list(arps())
ans=l
def arps():
    for p in packets:
        if is_arp(p):
            dstmac=hexx(p[:6])
            srcmac=hexx(p[6:12])
            sendmac=hexx(p[16+6:16+12])
            sendip=pretty_ip(p[16+12:16+12+4])
            targmac=hexx(p[16+12+4:16+12+4+6])
            targip=pretty_ip(p[16+12+4+6:16+12+4+6+4])
            opcode=p[20:22]
            opcode={1:'request',2:'reply'}[opcode[-1]]
            packet=p
            yield dict(packet=p,dstmac=dstmac,srcmac=srcmac,sendmac=sendmac,sendip=sendip,targmac=targmac,targip=targip,opcode=opcode)
ans=l
l=list(arps())
ans=l
ans=l
ans=int(ord('\x01'))
ans=devices
arp_requests={}
arp_requests={}#from sender to target
for p in l:
    if p['sendmac'] in devices:
        if p['sendmac'] not in arp_requests:
            arp_requests[p['sendmac']] = list()
        arp_requests[p['sendmac']].append(p['targmac'])
    
ans=arp_requests
for key in ans:
    ans[key]=set(ans[key])
arp_rqs= ans
display_dict(ans)
for _ in ans:
    pass
arp_freqs={i:len(e) for i,e in arp_rqs.items()}
ans=arp_freqs 
for i,e in enumerate(ans):
    print(i,e)
max_send_from=None
max_send=0
for i,e in (ans.items()):
    if e>max_send:
        max_send=e
    if e==max_send:
        max_send_from=i
    print(i,e)
ans=max_send_from
router_mac= ans
ans=router_mac
ans=devices
display_dict(arp_rqs)
ans=arps
ans=arps()
ans=l
display_dict(l[0])
for i,e in enumerate(l):
    print('Arp Packet Number',i)
    print('\t'+'Source Mac Address:'+e['srcmac'])
    print('\t'+'Source Mac Address:'+e['srcmac'])
# dstmac ⟶  ffffffffffff
# opcode ⟶  request
# packet ⟶  b'\xff\xff\xff\xff\xff\xff\x00P\x18]"\t\x08\x06\x00\x01\x08\x00\x06\x04\x00\x01\x00P\x18]"\t\xc0\xa8\x01\x88\x00\x00\x00\x00\x00\x00\xc0\xa8\x01\x88'
# sendip ⟶  192.168.1.136
# sendmac ⟶  0050185d2209
# srcmac ⟶  0050185d2209
# targip ⟶  192.168.1.136
# targmac ⟶  000000000000
#  ⮤ for i,e in enumerate(l):
#  2     print('Arp Packet Number',i)                                                      
#  3     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#  4     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#              NamespaceObject.print(value, ..., sep, end, file, flush)                   
#                                                    
for i,e in enumerate(l):
    dstmac=e['dstmac']
    opcode=e['opcode']
    packet=e['packet']
    sendip=e['sendip']
    sendmac=e['sendmac']
    srcmac=e['srcmac']
    targip=e['targip']
    targmac=e['targmac']
    print('Arp Packet Number',i)
    print('\t'+'Source Mac Address:'+srcmac)
    print('\t'+'Dest Mac Address:'+srcmac)
    print('\t'+'Source Ip Address:'+srcmac)
    print('\t'+'Dest Ip Address:'+srcmac)
    is_question=targmac=='000000000000'
    if(is_question):
        print('\tWHO has '+targip+'? Tell '+sendmac+' who has ip '+sendip+')')
    else:
        print(targmac+' has '+targip+' (sent to '+sendmac+' who has ip '+sendip+')')

# dstmac ⟶  ffffffffffff
# opcode ⟶  request
# packet ⟶  b'\xff\xff\xff\xff\xff\xff\x00P\x18]"\t\x08\x06\x00\x01\x08\x00\x06\x04\x00\x01\x00P\x18]"\t\xc0\xa8\x01\x88\x00\x00\x00\x00\x00\x00\xc0\xa8\x01\x88'
# sendip ⟶  192.168.1.136
# sendmac ⟶  0050185d2209
# srcmac ⟶  0050185d2209
# targip ⟶  192.168.1.136
# targmac ⟶  000000000000
#  ⮤ for i,e in enumerate(l):
#  2     print('Arp Packet Number',i)                                                      
#  3     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#  4     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#              NamespaceObject.print(value, ..., sep, end, file, flush)                   
#                                                    
for i,e in enumerate(l):
    dstmac=e['dstmac']
    opcode=e['opcode']
    packet=e['packet']
    sendip=e['sendip']
    sendmac=e['sendmac']
    srcmac=e['srcmac']
    targip=e['targip']
    targmac=e['targmac']
    print('Arp Packet Number',i)
    print('\t'+'Source Mac Address:'+srcmac)
    print('\t'+'Dest Mac Address:'+srcmac)
    print('\t'+'Source Ip Address:'+srcmac)
    print('\t'+'Dest Ip Address:'+srcmac)
    is_question=targmac=='000000000000'
    if(is_question):
        print('\tWHO has '+targip+'? (Tell '+sendmac+' at ip = '+sendip+')')
    else:
        print(targmac+' has '+targip+' (sent to '+sendmac+' at ip = '+sendip+')')

# dstmac ⟶  ffffffffffff
# opcode ⟶  request
# packet ⟶  b'\xff\xff\xff\xff\xff\xff\x00P\x18]"\t\x08\x06\x00\x01\x08\x00\x06\x04\x00\x01\x00P\x18]"\t\xc0\xa8\x01\x88\x00\x00\x00\x00\x00\x00\xc0\xa8\x01\x88'
# sendip ⟶  192.168.1.136
# sendmac ⟶  0050185d2209
# srcmac ⟶  0050185d2209
# targip ⟶  192.168.1.136
# targmac ⟶  000000000000
#  ⮤ for i,e in enumerate(l):
#  2     print('Arp Packet Number',i)                                                      
#  3     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#  4     print('\t'+'Source Mac Address:'+e['srcmac'])                                    
#              NamespaceObject.print(value, ..., sep, end, file, flush)                   
#                                                    
print=PRINT
for i,e in enumerate(l):
    dstmac=e['dstmac']
    opcode=e['opcode']
    packet=e['packet']
    sendip=e['sendip']
    sendmac=e['sendmac']
    srcmac=e['srcmac']
    targip=e['targip']
    targmac=e['targmac']
    print('Arp Packet Number',i)
    print('\t'+'Source Mac Address:'+srcmac)
    print('\t'+'Dest Mac Address:'+srcmac)
    print('\t'+'Source Ip Address:'+srcmac)
    print('\t'+'Dest Ip Address:'+srcmac)
    is_question=targmac=='000000000000'
    if(is_question):
        print('\tWHO has '+targip+'? (Tell '+sendmac+' at ip = '+sendip+')')
    else:
        print('\t'+targmac+' has '+targip+' (sent to '+sendmac+' at ip = '+sendip+')')
ans=None