---
title: "Forecasting Weather (Part 1): Ideas & Looking At The Data"
date: 2025-04-08
slug: weather-ai-part-1
tags: [python, blog, weather]
---

# Introduction:
Ever wonder why the weather app says there's heavy rain today, while you're sitting under the burning sun? Me too.    
Apparently it's not as easy as one might imagine, what we have today is borderline magic.   
But still curiosity got the better of me, so I decided to start this project, to uncover what makes it so challenging and maybe learn something along the way.    


# But How Does Weather Even Work?
I remember the weather related chapters used to be some of the most interesting chapters in geography, back in school. Even more so than the science classes (I'm a science student). It was one of those chapters that just made pure logical sense, without overwhelming the students with math.  
To better understand the numerical observations, we must first qualitatively understand what weather patterns on Earth actually look like. This part will try to cover as much as possible in a reasonable amount of time. (excuse the use of non-technical terms, it's meant to give an idea without getting into the jargon)  

## The Basic Mechanics:    
### Convection:    
Okay so this is typically common-knowledge, but as a refresher, **hot-air is typically lighter (less dense) than cold-air**. This causes hot air to rise up into the atmosphere, causing a **Vertical wind current**.    
### Drop In Temperature with height:   
(TODO: Continued)
<!-- 
# The Old Way: Crunching Numbers
Way back, predicting weather meant solving big equations-like how fluids move (Navier-Stokes, if you're nerdy). Think of it as slicing the sky into a grid and calculating what happens next. That's numerical weather prediction (NWP). Supercomputers run this for days, tweaking it with real data so it doesn't go off the rails. ERA5, my file, comes from that-past weather re-simulated with today's tech. It's a cheat sheet of what happened in 2024, and I'm using it to jumpstart my own model.

But here's the catch: those equations are slow, and tiny mistakes explode fast. Chaos, right? That's why I'm not stopping there.

# The New Way: AI's Turn
Then there's AI. I ran into GenCast-Google's trick from late 2024. It's this crazy model that skips the physics and learns patterns from piles of ERA5 data, spitting out 15-day forecasts in minutes. Wild. Or nowcasting-quick 0-6 hour guesses from radar pics. I'm aiming simpler: a day ahead with a neural network (CNN). Maybe I can nudge it with sparse data later, GenCast-style. It's less "solve the universe" and more "spot the trends"-faster, scrappier. -->

# Peeking at the Data:  
So after a few hours of research I stumbled upon [**ERA5**](https://cds.climate.copernicus.eu/datasets/reanalysis-era5-single-levels?tab=overview), it's probably the best historical dataset available for free. I did consider trying to get IMD data specific to India, but I guess ERA5 is good enough for a prototype. 
The dataset on its own is probably very huge (~ few Petabytes), so I decided to get only a few months and a few timestamps worth of data from **2024**, i.e, **Sep, Oct, Nov, Dec**. And roughly **4 hour** intervals.  
The website conviniently provides it's api guide, as well as auto-generation of the api request.   
here is the code:

```python
import cdsapi

dataset = "reanalysis-era5-single-levels"
request = {
    "product_type": ["reanalysis"],
    "variable": [
        "10m_u_component_of_wind",
        "10m_v_component_of_wind",
        "2m_temperature",
        "mean_sea_level_pressure"
    ],
    "year": ["2024"],
    "month": ["09", "10", "11", "12"],
    "day": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
             "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
             "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    "time": ["00:00", "01:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:00"],
    "data_format": "netcdf",
    "download_format": "unarchived"
}

client = cdsapi.Client()
client.retrieve(dataset, request).download()
```

(NOTE: apparently you're supposed to have a `.cdsapirc`, for authentication. But it's also supposed to be in `$HOME`, which makes it worse, and I spent a few hours figuring out how to have everything contained in the project folder itself (didn't work in the end))


If you didn't notice it yet, this was a really bad idea, here is why:   

- I talked about weather patterns and stuff before, so it's kind of ironic, having **4 consecutive months of weather data** instead of spaced out ones.
- For our use case, we wanted to **Nowcast** i.e predict hourly or even more fine-grained- having our original data itself be spaced by **4 hours**, makes it less than ideal. We might have to either **Re-download** with hourly data, or **interpolate locally** (which seems to be a lot of work) in the future.



A few other problems exist, but those are the major problems that I might have to tackle in the future. Now, on to the fun part.    

I did some searching and came across this library called `cartopy` ([link](https://scitools.org.uk/cartopy/docs/latest/), [github](https://github.com/SciTools/cartopy)), that seems to integrate seemlessly with `matplotlib`, and displays maps.