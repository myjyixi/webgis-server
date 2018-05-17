# -*- coding: utf-8 -*-
"""
Created on Mon Feb 26 11:01:58 2018

@author: CAG
"""

from  h5py import File
import numpy as np
from scipy.optimize import curve_fit
import jdcal
import argparse


import MySQLdb




alpha0 = 25.1035 # hangzhou
    
def find_attribute(gobj, dsobj, attr_name):
    for key in dsobj.attrs.keys():
        if key.find(attr_name) >= 0:
            return dsobj.attrs.get(key)
    for key in gobj.attrs.keys():
        if key.find(attr_name) >= 0:
            return gobj.attrs.get(key)
    return None
   
def key_parameters(Delta,RefMode):
    if RefMode==85:
        mu12=(384230406.373-1264.888+100.205-Delta*2)*2+6834.682-80*2
    elif RefMode==87:
        mu12=(384230484.468-2563.006+193.741-Delta)*2+6834.682-80*2
    elif RefMode==872:
        mu12=(384230484.468-2563.006+193.741-Delta)*2+6834.682
    else:
        mu12=[]

    keff=2*np.pi*mu12/299792458*1E6

# vrec
    m=86.91*1.9927E-26/12
    h=6.63E-34
    vrec=h*keff/2/np.pi/m
    return keff, vrec

def reject_outliers(data, m=2):
    return abs(data - np.median(data)) < m * np.std(data)

def main(args):

    #print(' import data')
    
    #filename = 'D:\\builds\\AII3\\AII_AgilentDDS\\HDF5\\B20180226.h5'
    #group = 'gMeas3'
    #dataset = '6Fringe'
    filename = args['filename']
    group =  args['group']
    dataset =  args['dataset']

    db=MySQLdb.connect(host=args['db'],user=args['db_user'],passwd=args['db_passwd'],db="gis")
    c=db.cursor()
    print('---connect-success')
    
    
    h5file = File(filename)
    h5ds = h5file.get('/'+group+'/'+dataset)
    h5g = h5file.get('/'+group)
    
    T= np.double(find_attribute(h5g, h5ds, 'T')/1000.0)
    # using this T value
    def cos_model_pos(x, a, b, x0):
        return b + a*(1-np.cos(2*np.pi*(x[0,:]-x0-(alpha0))*T**2
                           -0*x[1,:]+0*x[2,:]-0*x[3,:]))
    
    def cos_model_neg(x, a, b, x0):
        return b + a*(1-np.cos(2*np.pi*(x[0,:]-x0-(-alpha0))*T**2
                           -0*x[1,:]+0*x[2,:]-0*x[3,:]))
    
     
    ScanConfig = find_attribute(h5g, h5ds,'ScanConfigB')
    Scan=np.ceil(np.ceil((ScanConfig[2]-ScanConfig[1])*1E6)/(ScanConfig[3]*1E6))
    fringePoints=int(np.floor(Scan))
    sizeData=h5ds.shape
    fringeNum=int(sizeData[0]/fringePoints)
    
    
    datai=np.array(h5ds).reshape((fringeNum, fringePoints, 21))
    
    h5file.close()
    
    if fringeNum%2 != 0:
        fringeNum=fringeNum-1
    
    alpha = datai[:,:,20]
    N2 = datai[:,:,3]
    N1 = datai[:,:,4]
    tpx = datai[:,:,6]
    tpy = datai[:,:,7]
    #tx = datai[:,:,10]
    #ty = datai[:,:,11]
    SeisPhase1 = datai[:,:,12]
    SeisPhase2 = datai[:,:,13]
    SeisPhase3 = datai[:,:,14]
    t = datai[:,:,19]
    
    
    
    pairs = int((fringeNum-2)/2)
    t1 = np.zeros( (pairs,1) )
    tx1 = np.zeros( (pairs,1) )
    ty1 = np.zeros( (pairs,1) )
    x1lines = np.zeros( (pairs,1) )
    c1 = np.zeros( (pairs,1) )
    offset1 = np.zeros( (pairs,1) )
    
    x1 = 0.8E-4
    
    
    #print(' fitting fringes')
    k=0
    for i in range(2, fringeNum, 2):
        x=alpha[i, :]
        #y=ratio[:,i]
        y=(N2[i, :])/(N2[i, :]+N1[i, :]/1.0416)
        VP1=SeisPhase1[i, :]
        VP2=SeisPhase2[i, :]
        VP3=SeisPhase3[i, :]
    
        X= np.array([x,VP1,VP2,VP3])
    
        t1[k]=np.mean(t[i, :])
        tx1[k]=np.mean(tpx[i, :])
        ty1[k]=np.mean(tpy[i, :])
        # txp1=cat(1,txp1,mean(VPhase1(:,i)))
        # typ1=cat(1,typ1,mean(VPhase2(:,i)))
    
        beta0 = [(max(y)-min(y))/2, min(y),  x1]
    
        popt,pcov = curve_fit(cos_model_neg, X,y,beta0)
    
        x1lines[k]=popt[2]
        c1[k]=popt[0]
        offset1[k]=popt[1]
        k+=1
    
    
    t2 = np.zeros( (pairs,1) )
    tx2 = np.zeros( (pairs,1) )
    ty2 = np.zeros( (pairs,1) )
    x2lines = np.zeros( (pairs,1) )
    c2 = np.zeros( (pairs,1) )
    offset2 = np.zeros( (pairs,1) )
    
    
      
    x2 = 2.1E-4
    
    k=0
    for i in range(3, fringeNum, 2):
        x=-alpha[i, :]
        #y=ratio[:,i]
        y=(N2[i, :])/(N2[i, :]+N1[i, :]/1.0416)
        VP1=SeisPhase1[i, :]
        VP2=SeisPhase2[i, :]
        VP3=SeisPhase3[i, :]
    
        X= np.array([x,VP1,VP2,VP3])
    
        t2[k]=np.mean(t[i, :])
        tx2[k]=np.mean(tpx[i, :])
        ty2[k]=np.mean(tpy[i, :])
        # txp1=cat(1,txp1,mean(VPhase1(:,i)))
        # typ1=cat(1,typ1,mean(VPhase2(:,i)))
    
        beta0 = [(max(y)-min(y))/2, min(y),  x2]
    
        popt,pcov = curve_fit(cos_model_pos, X,y,beta0)
    
        x2lines[k]=popt[2]
        c2[k]=popt[0]
        offset2[k]=popt[1]
        k+=1
    
    
        
    keff,vrec = key_parameters(823.6,872)
    
    
    g0=2*np.pi*alpha0/1.610571887834030e+07*1E14
    g=2*np.pi*(alpha0+(x2lines-x1lines)/2)/keff*1E14-g0
    #PhiPos=2*np.pi*T*2*x2lines/keff/(T/1000)*2*1E8
    #PhiNeg=2*np.pi*T*2*x1lines/keff/(T/1000)*2*1E8
    DeltaCorr=2*np.pi*(x2lines+x1lines)/2/keff*1E14
    
    #print(' import tide model')
    # ETERNA
    tide2=np.genfromtxt('AII3_001 Hangzhou 20161101.prd',
                        skip_header=56,skip_footer=2)
    t=(t1+t2)/2
    t0=np.datetime64('2016-11-01T00:00')
    # 扫描开始时间'
    #tstart=datenum([1970, 1, 1, 0, 0, sec(1)])
    g_tide=np.zeros(g.shape)
    tidei=np.zeros(g.shape)
    
    for i in range(0, pairs):
        ti=np.datetime64('1904-01-01T00:00')+np.timedelta64(int(t[i,0]), 's')
        j=np.float64(ti-t0)/60
        frac=j-np.floor(j)
        j=int(np.floor(j))
        tidei[i]=-(tide2[j, 3]*(1-frac)+tide2[j+1, 3]*frac)/10
    
    #
    tx0=5.541E-3 #(10)mrad
    ty0=5.203E-3 #(12)mrad
    corrTilt=(430E6*(tx2*1E-3-tx0)**2+559E6*(ty2*1E-3-ty0)**2)
    g = g + corrTilt # add mmore system effects to get the real gravity
    
    g_corr = g + tidei # tide, polar and press remove 
    
    
    sel = reject_outliers(g_corr)
    
    g = g[sel]
    tidei = tidei[sel]
    c1 = c1[sel]
    c2 = c2[sel]
    offset1 = offset1[sel]
    offset2 = offset2[sel]
    g_corr = g_corr[sel]
    DeltaCorr = DeltaCorr[sel]
    corrTilt = corrTilt[sel]
    
    def labVIEWtime2mjd(time):
        ti =np.datetime64('1904-01-01T00:00')+np.timedelta64(int(time), 's')
        jd = jdcal.gcal2jd(ti.astype(object).year,ti.astype(object).month,
                           ti.astype(object).day)
        return jd[1]+(ti-ti.astype('datetime64[D]')).astype(float)/86400
    
    vfunc = np.vectorize(labVIEWtime2mjd)
    
    mjd = vfunc(t[sel])

    # output=dict()
    # output['mjd'] = mjd
    # output['g'] = g+g0
    # output['corrTide'] = tidei
    # output['c1'] = c1
    # output['c2'] = c2
    # output['offset1'] = offset1
    # output['offset2'] = offset2
    # output['gCorr'] = g_corr+g0
    # output['independ'] = DeltaCorr
    # output['corrTilt'] = corrTilt

    with open('insert_raw.sql', 'r') as sqlfile:
        sql=sqlfile.read()
        rows = 0
        lines = len(mjd)
        for i in range(lines):
            rows += c.execute(sql, (mjd[i], g[i]+g0, tidei[i], g_corr[i]+g0, DeltaCorr[i], corrTilt[i], 0.0, 0.0, args['event_id']) )

    db.commit()
    c.close()
    db.close()

    #print('{}\n'.format(rows))

    # output_2d = np.concatenate([[mjd,g,tidei,c1,c2,offset1,offset2,g_corr,
    #                            DeltaCorr,corrTilt]],1)
    # output_2d=output_2d.T
    # np.savetxt('output2d.txt', output_2d)
    
    # filename_out = filename+'.out.h5'
    
    # h5file_out = File(filename_out,'w')
    # h5ds_out = h5file_out.create_dataset('/'+group+'/'+dataset,(10,10), 
    #                                      maxshape=(None, 10),chunks=(10,10),
    #                                               dtype=np.float64)
    # h5ds_out.resize(output_2d.shape)
    # h5ds_out[:] = output_2d
    # h5file_out.close()
    t_measure = np.mean(t)

    time_measure = np.datetime64('1904-01-01T00:00')+np.timedelta64(int(t_measure), 's')

    time_str = np.datetime_as_string([time_measure],unit='s')

    print('{{\"\nStatus\":{},\n \"g\":{:.2f}, \n\"measuremnet_time\":\"{}\"\n }}\n'.format(1, np.mean(g_corr), time_str))
    return


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Process raw gravity data.')
    parser.add_argument('--path', help='input hdf5 datafile')
    parser.add_argument('--taskgroup', help='group/task of this run')
    parser.add_argument('--task', help='group/task of this run')
    parser.add_argument('--db', help='MySQL database address')
    parser.add_argument('--db_user', help='Database username')
    parser.add_argument('--db_passwd', help='Database password')
    parser.add_argument('--event_id', type=int, help='Event id in measurement_event table')

    args = parser.parse_args()

    args_dict = dict()
    args_dict['filename'] = args.path
    args_dict['group'] = args.taskgroup
    args_dict['dataset'] = args.task
    args_dict['db'] = args.db
    args_dict['db_user']=args.db_user
    args_dict['db_passwd']=args.db_passwd
    args_dict['event_id']=args.event_id
    main(args_dict)
