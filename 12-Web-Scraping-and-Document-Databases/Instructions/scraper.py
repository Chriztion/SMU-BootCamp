from splinter import Browser
from bs4 import BeautifulSoup as bs
import pandas as pd
import time
import json
import datetime

def scrape():
    #Chrome Driver
    executable_path = {'executable_path': '../../../chromedriver'}
    browser = Browser('chrome', **executable_path, headless=True)
    
    #NASA Website Scraper 
    #
    url = 'https://mars.nasa.gov/news/'
    browser.visit(url)
    time.sleep(1)
    
    #Make some soup 
    html = browser.html
    soup = bs(html, "html.parser")
    
    #grab article title
    article_title = soup.find_all('div', {'class':'content_title'})[1].text.strip()
    
    #grab article teaser paragraph 
    article_teaser = soup.find_all('div', {'class':'article_teaser_body'})[1].text
    
    #JPL Img
    
    url_jpl = 'https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars'
    browser.visit(url_jpl)
    browser.click_link_by_id("full_image")
    time.sleep(1)
    
    #  Make some soup
    html_jpl = browser.html
    soup_jpl = bs(html_jpl, "html.parser")
    
    
    temp = soup_jpl.find('img', {'class':'fancybox-image'})['src']
    figure_url = 'https://www.jpl.nasa.gov' + temp
    
    #Mars Twitter scraper
    
    url_twitter = 'https://twitter.com/marswxreport?lang=en'
    browser.visit(url_twitter)
    time.sleep(1)
    
    
    html_twitter = browser.html
    soup_twitter = bs(html_twitter, "html.parser")
    time.sleep(1)
    
    # Find Tweets
    tweet_div = soup_twitter.find('div',{'data-testid':'tweet'})
    #tweet_spans = tweet_div.find_all('span')
    
    
    for span in tweet_div: 
        if "InSight sol" in span.text: 
            tweet = span.text
            break
    
    #Mars Facts Scraper 
    mars_facts = pd.read_html('https://space-facts.com/mars/')[0]
    mars_facts = mars_facts.rename(columns = {mars_facts.columns[0]:'Attribute',mars_facts.columns[1]:'Value',})
    mars_json = json.loads(mars_facts.to_json(orient="records"))
    
    #Hemisphere Images Scraper 
    tempHemi = 'https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars'
    browser.visit(tempHemi)
    time.sleep(1)
    
    html = browser.html
    soup = bs(html, "html.parser")
    
    images = soup.find_all(['a', 'img alt'], {'class':'itemLink product-item'})
    
    hemiLinks = []
    
    for image in images: 
        link = 'https://astrogeology.usgs.gov' + image['href']
        hemiLinks.append(link)
    hemiLinks = set(hemiLinks)
    
    
    listHemi = []
    for link in hemiLinks: 
        browser.visit(link)
        time.sleep(1)
        
        html = browser.html
        soup = bs(html, "html.parser")
        partial = soup.find(['img'], {'class':'wide-image'})['src']
        full_link = 'https://astrogeology.usgs.gov' + partial
        title = soup.find(['h2'], {'class':'title'}).text
        dict_entry = {'title':title, 'img_url':full_link}
        listHemi.append(dict_entry)
    
    #Close the browser
    browser.quit()
     # Dictionary
    marsDict = {
        "newsTitle": article_title,
        "newsTeaser": article_teaser,
        "featureImageURL": figure_url,
        "tweetWeatherText": tweet,
        "marsStats": mars_json,
        "HemisphereImages": listHemi,
        "dateScraped": datetime.datetime.now()
    }
    
    return marsDict