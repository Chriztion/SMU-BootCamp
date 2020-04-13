# Read in Data

import csv

print("Election Results")
print("____________________________")

csvpath = r"C:\Users\Chris\Desktop\SMU-BootCamp\03-Python\Instructions\PyPoll\Resources\election_data.csv"

# Get total number of voters

voters = 0

# Open csv (make sure to indent correctly)
with open(csvpath) as csvfile:
    csvreader = csv.reader(csvfile)
    csvheader = next(csvreader)
    for row in csvreader:
        voters += 1 
    print(f'Total Votes: {voters}')

# Declare indexes
numVotes = []
candidates = []
percentageVotes = []

# Reopen csv file 

voters = 0
with open(csvpath, newline = "") as csvfile:
   csvreader = csv.reader(csvfile, delimiter = ",")
   csvheader = next(csvreader)
   for row in csvreader:
       # AAdd to the vote counter 

       voters += 1
       
       if row[2] not in candidates:
           candidates.append(row[2])
           index = candidates.index(row[2])
           numVotes.append(1)
       else:
           numVotes[index] += 1
           index = candidates.index(row[2])
           

   # Add to percent_votes list
   for votes in numVotes:

       percent = (votes/voters) * 100

       percent = round(percent)

       percent = "%.3f%%" % percent

       percentageVotes.append(percent)

   # Find the winner

   winner = max(numVotes)
   index = numVotes.index(winner)
   leadCandidate = candidates[index]

# Display the results


print("_____________________________")
for x in range(len(candidates)):
   print(f"{candidates[x]}: {str(percentageVotes[x])} ({str(numVotes[x])})")
print("_____________________________")
print(f" The Winner: {leadCandidate}")
print("_____________________________")

 
# Save to a txt file 
 
textFile = 'pypoll.txt'
with open(textFile,"w") as txtfile:
# Display text 
    txtfile.write("Election Results")
    txtfile.write("\n")
    txtfile.write("______________________________________")
    txtfile.write("\n")
    txtfile.write(f'Total Votes : {voters}')
    txtfile.write("\n")
    txtfile.write("______________________________________")
    txtfile.write("\n")
    #for x in range(len(candidates)):
        #line = {f"{candidates[x]}: {str(percent_votes[x)} ({str(num_votes[x])})"
        #txtfile.write('{}\n'.format(line))
    txtfile.write("______________________________________")
    txtfile.write("\n")
    txtfile.write(f"Winner: ${leadCandidate}") 
