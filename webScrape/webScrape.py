#@author Tim Hodson with credits to Beautiful Soup: https://www.crummy.com/software/BeautifulSoup/
# Additional credits to this walkthrough: https://medium.freecodecamp.org/how-to-scrape-websites-with-python-and-beautifulsoup-5946935d93fe

# import libraries
import urllib2
import json
from bs4 import BeautifulSoup #Remember to download and pip install beautifulsoup4
import csv

# specify the url
#crimePage = "file:///Users/Tim/Documents/webScrape/jan1jan15.html"

# query the website and return the html to the variable page
page = urllib2.urlopen("file:///Users/Tim/Documents/webScrape/endJan.html").read()


# parse the html using beautiful soap and store in variable soup
soup = BeautifulSoup(page, "html.parser")

table = soup.find('table') #finds the table for the page. You may need to use "find all" and a loop for multiple tables

data = []
rows = table.findAll('tr') #find all rows of theh table
for row in rows: #for every row, extract the data
    cols = row.find_all('td')
    cols = [ele.text.strip() for ele in cols]
    data.append([ele for ele in cols if ele]) # Get rid of empty values

str_list = []
str_list = filter(None, data) #Strip empty values

newList = []
i = 0
#iterate through str_list and combine array elements into a usable format, then seperate with a $ to use in excel cleanup. 
while i < (len(str_list)):
    newList.append(str_list[i][0] + "$ " + str_list[i][1] + "$ " + str_list[i][2] + "$ " + str_list[i][3]+ "$ " + str_list[i][4]+ "$ " + str_list[i][5]+ "$ " + str_list[i][6]+ "$ " + str_list[i+1][0])
    i = i+2

#Write the data to CSV
with open("/Users/Tim/Documents/WebDesign/endJan.csv",'w') as myfile:
    wr = csv.writer(myfile)
    header=['type','id','numberOfUpdates','isPingEnabled','lastUpdated']
    for ele in newList:
        wr.writerow([[ele]])