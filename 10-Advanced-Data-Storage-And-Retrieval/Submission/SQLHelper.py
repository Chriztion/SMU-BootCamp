import datetime as dt
import numpy as np
import pandas as pd
from sqlalchemy import create_engine

# Define a Class
class SQL_Helper():
    # Initialize engine and connection_string 
    def __init__(self):
        self.connection_string = "sqlite:///hawaii.sqlite"
        self.engine = create_engine(self.connection_string)

 # Get Precipitation Data from the Last 12 Months of dataset 
    def getRain(self): 
        query_rain = f"""
                SELECT
                    date, 
                    prcp
                FROM 
                    measurement
                WHERE 
                    date > DATE('2017-08-23', '-12 months')
                """
        conn = self.engine.connect()
        df = pd.read_sql(query_rain, conn)
        conn.close()

        return df

# List all stations and the Frequency(Activity)
    def getStations(self):
        query_station = f"""
            SELECT
                station, 
                COUNT(station) as Activity
            FROM 
                measurement 
            GROUP BY 
                station
            ORDER BY Activity DESC
            """
        conn2= self.engine.connect()
        df2 = pd.read_sql(query_station, conn2)
        conn2.close()

        return df2

 # Get the Most Popular Station 
    def getPopStation(self, station):
        query_popular = f"""
            SELECT 
                date,
                tobs as Temperature
            FROM 
                measurement
            WHERE 
                station = '{station}' AND 
                date > DATE('2017-08-23', '-12 months')
            """
        conn3 = self.engine.connect()
        df3 = pd.read_sql(query_popular,conn3)
        conn3.close()

        return df3


 # Get temp info from a given date (date must be a string)
 # Date must be format like '2017-08-23'
    def dateTempInfo (self, start_date = '2010-01-01'):
            query_start = f"""
                        SELECT 
                            date,
                            MIN(tobs) as min_temp,
                            MAX(tobs) as max_temp,
                            AVG(tobs) as avg_temp
                        FROM
                            measurement
                        WHERE
                            date = '{start_date}'
                    """
            conn4 = self.engine.connect()
            df4 = pd.read_sql(query_start,conn4)
            conn4.close()

            return df4

    # Get temp info for a date range  (date must be a string)
    # Date must be format like '2017-08-23'
    def dateRangeTemp(self, start, end):
        query_last= f"""
            SELECT 
                min(tobs) as min_temp,
                max(tobs) as max_temp,
                avg(tobs) as avg_temp
            FROM
                measurement
            WHERE
                date >= '{start}'
                AND date < '{end}'
            """

        conn = self.engine.connect()
        df = pd.read_sql(query_last, conn)
        conn.close()

        return df