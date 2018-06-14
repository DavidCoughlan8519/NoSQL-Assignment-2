# --------------------------------------------------------
#           PYTHON PROGRAM
# Here is where we are going to define our set of...
# - Imports
# - Global Variables
# - Functions
# ...to achieve the functionality required.
# When executing > python 'this_file'.py in a terminal,
# the Python interpreter will load our program,
# but it will execute nothing yet.
# --------------------------------------------------------

import pymongo
from bson.son import SON

# ------------------------------------------
# FUNCTION 1: most_popular_cuisine
# ------------------------------------------
def most_popular_cuisine(db):
    # 1. Create the pipeline of actions to query the collection
    pipeline1 = [
        {"$group": {"_id": "$cuisine", "count": {"$sum": 1}}},
        {"$sort": SON([("count", -1), ("_id", -1)])},
        {"$limit": 1}
    ]

    # 1.4. Trigger the query to the MongoDB and convert the result to a list of documents
    popular_cuisines = db.restaurants.aggregate(pipeline1)
    popular_cuisines = popular_cuisines.next()


    # 2. Get the total amount of restaurants
    total = popular_cuisines.get("count") / db.restaurants.count() * 100

    # 3. Extract the name of the cuisine we are looking for (and its percentage of restaurants)
    most_popular = popular_cuisines.get("_id")

    # 4. Return this cuisine name
    return most_popular, total

# ------------------------------------------
# FUNCTION 2: ratio_per_borough_and_cuisine
# ------------------------------------------
def ratio_per_borough_and_cuisine(db, cuisine):
    # 1. First pipeline: Query the collection to get how many restaurants are there per borough
    pipeline1 = [
        {"$group": {"_id": "$borough", "count": {"$sum": 1}}}
    ]

    rest = db.restaurants.aggregate(pipeline1)
    # 2. Second pipeline: Query the collection to get how many restaurants (of the kind of cuisine we are looking for) are there per borough
    pipeline2 = [
        { "$match": { "cuisine": cuisine } },
        { "$group": {"_id": "$borough", "count": {"$sum": 1}}}
    ]
    rest2 = db.restaurants.aggregate(pipeline2)
    ratio = dict()
    for x in rest:
        ratio[x.get("_id")] = x.get("count")
    # 3. Combine the results of the two queries, so as to get the ratio of restaurants (of the kind of cuisine we are looking for) per borough
    # Plese note that the documents of first and second query might not fully match. That is, it might be the unlikely case in which, for one of the boroughs, there is no restaurant (of this kind of cuisine we are looking for) at all.
    for x in rest2:
        ratio[x.get("_id")] = [ratio.get(x.get("_id")), x.get("count")]
    # 4. Select the name and ratio of the borough with smaller ratio
    name = ""
    y = 0
    for x in ratio:
        ratio[x] = (ratio.get(x)[1] / ratio.get(x)[0])*100
        if y is 0:
            y = ratio.get(x)
        if ratio.get(x) < y:
            y = ratio.get(x)
            name = x
    ratio = ratio.get(name)


    # 5. Return the selected borough and its ratio
    return (name, ratio)

# ------------------------------------------
# FUNCTION 3: ratio_per_zipcode
# ------------------------------------------
def ratio_per_zipcode(db, cuisine, borough):
    # 1. First pipeline: Query the collection to get the biggest five zipcodes of the borough (in which we are going to open the new restaurant)
    pipeline1 = [
        { "$match": { "borough": borough } },
        { "$group": {"_id": "$address.zipcode", "count": {"$sum": 1}}},
        { "$sort": SON([("count", -1), ("_id", -1)])},
        { "$limit": 5}
    ]
    pip1 = db.restaurants.aggregate(pipeline1)

    # 2. Second pipeline: Query the collection to get how many zipcodes of the borough include restaurants of the kind of cuisine we are looking for
    pipeline2 = [
        { "$match": { "borough": borough, "cuisine": cuisine } },
        { "$group": {"_id": "$address.zipcode", "count": {"$sum": 1}}}
    ]
    pip2 = db.restaurants.aggregate(pipeline2)

    # 3. Combine the results of the two queries, so as to compute the ratio of restaurants (of our kind of cuisine) for each of the 5 biggests zipcodes of the borough
    # Plese note that the documents of first and second query might not fully match. That is, there might be more than 5 zipcodes in the second query. Also, it might be the unlikely case in which, for one of the biggest zipcodes of the borough, there is no restaurant (of the kind of cuisine we are looking for) at all.
    ratio = dict()
    for x in pip1:
        ratio[x.get("_id")] = x.get("count")
    for x in pip2:
        if x.get("_id") in ratio:
            ratio[x.get("_id")] = [ratio.get(x.get("_id")), x.get("count")]

    name = ""
    y = 0
    for x in ratio:
        ratio[x] = (ratio.get(x)[1] / ratio.get(x)[0])*100
        if y is 0:
            y = ratio.get(x)
        if ratio.get(x) < y:
            y = ratio.get(x)
            name = x
    ratio = ratio.get(name)


    return (name, ratio)

# ------------------------------------------
# FUNCTION 4: best_restaurants
# ------------------------------------------
def best_restaurants(db, cuisine, borough, zipcode):
    # 1. First pipeline: Query the collection to get the three restaurants of this borough, zipcode and kind of cuisine with better average review.
    # Filter the restaurants to consider only these ones with more than 4 or more reviews.
    pipeline1 = [
        {"$unwind": "$grades"},
        { "$match": { "borough": borough, "cuisine": cuisine, "address.zipcode": zipcode, "grades": {"$gt": {"$size": 4}} } },
        { "$group": {"_id": "$name", "averageScore": { "$avg": "$grades.score" },"count": {"$sum": 1}}},
        { "$sort": SON([("count", -1), ("_id", -1)])},
        { "$limit": 3}
    ]
    #{ "grades.score": { $gt: 30 } }
    #$and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } }
    pip1 = db.restaurants.aggregate(pipeline1)

    # 2. Format the result to a list of pairs
    name = []
    reviews = []

    for x in pip1:
        name.append(x.get("_id"))
        reviews.append(x.get("averageScore"))


    # 3. Return the selected restaurant names and average review scores
    return name, reviews

# ------------------------------------------
# FUNCTION my_main
# ------------------------------------------/
def my_main():
    # 0. We set up the connection to the cluster
    client = pymongo.MongoClient("localhost", 27000)
    db = client.test

    # 1. What is the kind of cuisine with more restaurants in the city?
    (cuisine, ratio_cuisine) = most_popular_cuisine(db)
    print("1. The kind of cuisine with more restaurants in the city is", cuisine, "(with a", ratio_cuisine, "percentage of restaurants of the city)")

    # 2. Which is the borough with smaller ratio of restaurants of this kind of cuisine?
    (borough, ratio_borough) = ratio_per_borough_and_cuisine(db, cuisine)
    print("2. The borough with smaller ratio of restaurants of this kind of cuisine is", borough, "(with a", ratio_borough, "percentage of restaurants of this kind)")

    # 3. Which of the 5 biggest zipcodes of the borough has a smaller ratio of restaurants of the cuisine we are looking for?)
    (zipcode, ratio_zipcode) = ratio_per_zipcode(db, cuisine, borough)
    print("3. The zipcode of the borough with smaller ratio of restaurants of this kind of cuisine is zipcode =", zipcode, "(with a", ratio_zipcode, "percentage of restaurants of this kind)")

    # 4. Which are the best 3 restaurants (of the kind of cuisine we are looking for) of our zipcode?
    (best, reviews) = best_restaurants(db, cuisine, borough, zipcode)
    print("4. The best three restaurants (of this kind of couisine) at these zipcode are:", best[0], "(with average reviews score of", reviews[0], "),", best[1], "(with average reviews score of", reviews[1], "),", best[2], "(with average reviews score of", reviews[2], ")")

# ---------------------------------------------------------------
#           PYTHON EXECUTION
# This is the main entry point to the execution of our program.
# It provides a call to the 'main function' defined in our
# Python program, making the Python interpreter to trigger
# its execution.
# ---------------------------------------------------------------
if __name__ == '__main__':
    my_main()

