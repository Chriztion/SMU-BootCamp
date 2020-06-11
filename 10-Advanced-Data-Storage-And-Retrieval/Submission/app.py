#IMPORT DEPENDENCIES
import numpy as np
import pandas as pd
from sqlalchemy import create_engine, func
from flask import Flask, jsonify
import json


from SQLHelper import SQL_Helper

# Set up flask 
app = Flask(__name__)

# Set up sqlhelper 
sqlHelper = SQL_Helper()

# make your routes
@app.route("/")
def home_page():
    return(f"""<h1>Hawaii Weather API</h1> <h3>Pages: </h3>
                <li> <a href='/api/v1.0/precipitation'>Precipitation</a> <br/></li>
                <li> <a href='/api/v1.0/stations'>Stations</a> <br/></li>
                <li> <a href='/api/v1.0/tobs'>Most Popular Station</a> <br/></li>
                <li> <a href='/api/v1.0/dates/2016-08-23/2017-08-23'>Get Temperature for Date</a><br/></li>
                <li> <a href='/api/v1.0/date/2016-08-23'>Get Temperature for Date Range</a></li>
            </ul>
            """)
@app.route("/api/v1.0/precipitation")
def precipitation_page():

    data = sqlHelper.getRain()
    # convert to string data (FOR EACH PAGE)
    string_data = data.to_json(orient='records')
    # convert to list (FOR EACH PAGE)
    list_data = json.loads(string_data)
    # jsonify the list and return (FOR EACH PAGE)
    return (jsonify(list_data))

@app.route('/api/v1.0/stations')
def stations_page():
    data2 = sqlHelper.getStations()
    string_data2 = data2.to_json(orient='records')
    list_data2 = json.loads(string_data2)
    return (jsonify(list_data2))

@app.route('/api/v1.0/tobs')
def tobs_page():
    data3 = sqlHelper.getPopStation('USC00519281')
    string_data3 = data3.to_json(orient='records')
    list_data3 = json.loads(string_data3)
    return (jsonify(list_data3))

@app.route('/api/v1.0/date/<start_date>')
def date_page(start_date):
    data4 = sqlHelper.dateTempInfo(start_date)
    string_data4 = data4.to_json(orient='records')
    list_data4 = json.loads(string_data4)
    return (jsonify(list_data4))

@app.route('/api/v1.0/dates/<start_date>/<end_date>')
def dates_page(start_date, end_date):
    data5 = sqlHelper.dateRangeTemp(start_date, end_date)
    string_data5 = data5.to_json(orient='records')
    list_data5 = json.loads(string_data5)
    return (jsonify(list_data5))



# Run the app
if __name__ == "__main__":
    app.run(debug=True)