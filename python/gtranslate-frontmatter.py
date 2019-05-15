import frontmatter
import os

filepath = os.path.join("content", "_index.md")
post = frontmatter.load(filepath)
for item in post.keys():
    # print (item +" = "  + str(post[item]) )
    print (item)
    if type(post[item]) is list:
        pitem = post[item]
        print(item + " is a list")
        count = 0
        for i in range(len(pitem)):
            print (pitem[i])
            if pitem[i] is dict:
                count +=1
                print("dict  pitem"+ str(pitem[i]))
    else:
        print("translating:"+ post[item])