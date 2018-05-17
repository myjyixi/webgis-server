REM test_uploat.bat
REM benfre <benfre@sohu.com>

REM 如果使用 venv 的话， 需要提前运行以下命令
REM python -m venv venv
REM pip install -r requirements.txt


REM 如果使用 Anaconda 的话需要激活
REM 并且提前运行
REM pip install mysqlclient

call C:\Users\hipaa\Anaconda3\Scripts\activate.bat C:\Users\hipaa\Anaconda3

REM working dir
cd E:\local\h5_treat


REM 确保 event_id 在 measuring_event 表中存在

python h5treat.py --path="uploads\\B20180226.h5" --taskgroup="AllTask" --task="6Fringe" --db="localhost" --db_user="gis" --db_passwd="aeiou3331" --event_id=9

call C:\Users\hipaa\Anaconda3\Scripts\deactivate.bat