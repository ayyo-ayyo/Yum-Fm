'''menu item builder'''
import json
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException

def json_builder(filename, div):
    '''builds json (in a scuffed way)'''
    i = div
    item = {}
    item["name"] = driver.find_element(By.XPATH, "/html[1]/body[1]/div[1]/div[4]/div[2]/div[1]/div[2]/div[2]/div[1]/div[2]/h2[1]/span[1]").text
    print("\t" * 1 + f"item name = {item['name']}")
    try:
        price = driver.find_element(By.XPATH, "/html[1]/body[1]/div[1]/div[4]/div[2]/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[1]/button[1]/span[1]/span[1]/span[1]/span[1]").text
    except NoSuchElementException:
        price = driver.find_element(By.XPATH, "/html[1]/body[1]/div[1]/div[4]/div[2]/div[1]/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/button[1]/span[1]/span[1]/span[1]/span[1]").text
    item["price"] = price.split(sep = "$")[1]
    print("\t" * 1 + f"item price = {item['price']}")
    options = []
    while True:
        option = {}
        try:
            features_elements = driver.find_elements(By.XPATH, f"/html[1]/body[1]/div[1]/div[4]/div[2]/div[1]/div[2]/div[2]/div[2]/div[1]/div[1]/div[1]/div[{i}]/div")
        except NoSuchElementException:
            break
        option_info = features_elements[0].text.split(sep = "\n")
        if "Preferences" in option_info:
            break
        option["type"] = option_info[0]
        print("\t" * 2 + f"option type = {option['type']}")
        num = option_info[-1].split()[-1]
        if option_info[1] == "Required":
            option["required"] = int(num)
            option["upto"] = int(num)
        else:
            option["required"] = 0
            option["upto"] = None if len(option_info) == 2 else int(num)
        print("\t" * 2 + f"required = {option['required']}")
        print("\t" * 2 + f"upto = {option['upto']}")
        feature_len = 1
        features = []
        while feature_len < len(features_elements):
            feature = {}
            name_price = features_elements[feature_len].text.split(sep = "\n")
            feature["name"] = name_price[0]
            print("\t" * 3 + f"feature name = {feature['name']}")
            if len(name_price) > 1:
                cal_or_price = name_price[-1].split(sep = "$")[-1]
                feature["price"] = "0.00" if "cal" in cal_or_price else cal_or_price
            else:
                feature["price"] = "0.00"
            print("\t" * 3 + f"feature price = {feature['price']}")
            # customizations = []
            # while True:
            #     customization = {}
            #     customization_name = input("customization name: ")
            #     if customization_name == "":
            #         break
            #     customization["name"] = customization_name
            #     customization["price"] = float(input("customization price: "))
            #     customizations.append(customization)
            # feature["customizations"] = customizations
            features.append(feature)
            feature_len += 1
        option["features"] = features
        options.append(option)
        i += 1
    item["options"] = options

    with open(filename, "w", encoding = "utf-8") as f:
        json.dump(item, f, indent = 2)

opts = uc.ChromeOptions()
opts.headless = False
driver = uc.Chrome(use_subprocess = True, options = opts)

driver.get("https://www.doordash.com/home/")

j = 1
while True:
    initial_div = int(input("enter div: "))
    json_builder(str(j).zfill(3) + ".json", initial_div)
    j += 1
