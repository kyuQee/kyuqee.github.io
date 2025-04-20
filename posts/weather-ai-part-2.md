---
title: "Forecasting Weather (Part 2): Fighting the data"
date: 2025-04-20
slug: weather-ai-part-2
tags: [python, blog, weather]
---

You can read the previous part [here](weather-ai-part-1.html).

# Overview:
Last time was a disaster as I realised that I had naively thrown together code, without knowing much. We were also missing the most important variables, i.e, **total precipitation (tc)** and **total cloud cover (tcc)**. As I explored the data, I ran into numerous errors and weird quirks (which was made worse by being lazy and using AI, to fix the errors, so I stopped using it midway).  
In this post I'd like to go through all the errors in chronological order (the order in which I ran into them), and finally get to writing helper functions for plotting/visualizing the data.

<br>

# The Right Data:
Okay, so having data spaced at **4 hour intervals**, for a nowcasting project, was far from ideal. So instead I decided to take only 1 month of data but have complete hourly data.
I also included **total precipitation (tp)**, **total cloud cover (tcc)**, and **geopotential (z)** (because we might need it to augment the model with topological data contraints, but we'll see).
I also switched to **GRIB** instead of **NetCDF**, the reasons are as you will see ahead.

Also we needed the best month to get the data from, with plenty of activity going on, so I picked **July 2024**.

So the final download request looked like:

```python
import cdsapi

dataset = "reanalysis-era5-single-levels"
request = {
    "product_type": ["reanalysis"],
    "variable": [
        "2m_temperature",
        "10m_u_component_of_wind",
        "10m_v_component_of_wind",
        "relative_humidity",
        "total_precipitation",
        "surface_pressure",
        "total_cloud_cover",
        "geopotential"
    ],
    "year": ["2024"],
    "month": ["07"],
    "day": [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"
    ],
    "time": [
        "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
        "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
        "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
    ],
    "data_format": "grib",
    "download_format": "unarchived",
    "area": "global"
}

client = cdsapi.Client()
client.retrieve(dataset, request).download()

```

(I saved the file as `era5_july2024_global_hourly.grib`)    

<br>

# Problem 1: Heterogenous Data  
I didn't know the structure of the data I was using, so it was quite the headache to figure stuff out. I did come across this website: [ECMWF Parameter Database](https://codes.ecmwf.int/grib/param-db/). But It was already too late. 

(NOTE: the next part is before I switched to GRIB)

So excited to try out the new dataset, I did:

```python

import xarray as xr

# Load the NetCDF file
ds = xr.open_dataset("era5_july2024_global_hourly.nc", engine="netcdf4")

# Print the dataset summary
print(ds)

```

and gracefully got the error:

<div class="error-block">
<details>
<summary>OSError: NetCDF: Unknown file format</summary>
<pre>
---------------------------------------------------------------------------
KeyError                                  Traceback (most recent call last)
File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\file_manager.py:211, in CachingFileManager._acquire_with_cache_info(self, needs_lock)
    210 try:
--> 211     file = self._cache[self._key]
    212 except KeyError:

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\lru_cache.py:56, in LRUCache.__getitem__(self, key)
    55 with self._lock:
---> 56     value = self._cache[key]
    57     self._cache.move_to_end(key)

KeyError: [<class 'netCDF4._netCDF4.Dataset'>, ('c:\\dev\\weather\\era5_july2024_global_hourly.nc',), 'r', (('clobber', True), ('diskless', False), ('format', 'NETCDF4'), ('persist', False)), 'df0025b7-69bf-4128-8320-5d00cce38840']

During handling of the above exception, another exception occurred:

OSError                                   Traceback (most recent call last)
Cell In[4], line 4
    1 import xarray as xr
    3 # Load the NetCDF file
----> 4 ds = xr.open_dataset("era5_july2024_global_hourly.nc", engine="netcdf4")
    6 # Print the dataset summary
    7 print(ds)

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\api.py:687, in open_dataset(filename_or_obj, engine, chunks, cache, decode_cf, mask_and_scale, decode_times, decode_timedelta, use_cftime, concat_characters, decode_coords, drop_variables, inline_array, chunked_array_type, from_array_kwargs, backend_kwargs, **kwargs)
    675 decoders = _resolve_decoders_kwargs(
    676     decode_cf,
    677     open_backend_dataset_parameters=backend.open_dataset_parameters,
(...)
    683     decode_coords=decode_coords,
    684 )
    686 overwrite_encoded_chunks = kwargs.pop("overwrite_encoded_chunks", None)
--> 687 backend_ds = backend.open_dataset(
    688     filename_or_obj,
    689     drop_variables=drop_variables,
    690     **decoders,
    691     **kwargs,
    692 )
    693 ds = _dataset_from_backend_dataset(
    694     backend_ds,
    695     filename_or_obj,
(...)
    705     **kwargs,
    706 )
    707 return ds

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\netCDF4_.py:666, in NetCDF4BackendEntrypoint.open_dataset(self, filename_or_obj, mask_and_scale, decode_times, concat_characters, decode_coords, drop_variables, use_cftime, decode_timedelta, group, mode, format, clobber, diskless, persist, auto_complex, lock, autoclose)
    644 def open_dataset(
    645     self,
    646     filename_or_obj: str | os.PathLike[Any] | ReadBuffer | AbstractDataStore,
(...)
    663     autoclose=False,
    664 ) -> Dataset:
    665     filename_or_obj = _normalize_path(filename_or_obj)
--> 666     store = NetCDF4DataStore.open(
    667         filename_or_obj,
    668         mode=mode,
    669         format=format,
    670         group=group,
    671         clobber=clobber,
    672         diskless=diskless,
    673         persist=persist,
    674         auto_complex=auto_complex,
    675         lock=lock,
    676         autoclose=autoclose,
    677     )
    679     store_entrypoint = StoreBackendEntrypoint()
    680     with close_on_error(store):

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\netCDF4_.py:452, in NetCDF4DataStore.open(cls, filename, mode, format, group, clobber, diskless, persist, auto_complex, lock, lock_maker, autoclose)
    448     kwargs["auto_complex"] = auto_complex
    449 manager = CachingFileManager(
    450     netCDF4.Dataset, filename, mode=mode, kwargs=kwargs
    451 )
--> 452 return cls(manager, group=group, mode=mode, lock=lock, autoclose=autoclose)

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\netCDF4_.py:393, in NetCDF4DataStore.__init__(self, manager, group, mode, lock, autoclose)
    391 self._group = group
    392 self._mode = mode
--> 393 self.format = self.ds.data_model
    394 self._filename = self.ds.filepath()
    395 self.is_remote = is_remote_uri(self._filename)

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\netCDF4_.py:461, in NetCDF4DataStore.ds(self)
    459 @property
    460 def ds(self):
--> 461     return self._acquire()

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\netCDF4_.py:455, in NetCDF4DataStore._acquire(self, needs_lock)
    454 def _acquire(self, needs_lock=True):
--> 455     with self._manager.acquire_context(needs_lock) as root:
    456         ds = _nc4_require_group(root, self._group, self._mode)
    457     return ds

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\contextlib.py:137, in _GeneratorContextManager.__enter__(self)
    135 del self.args, self.kwds, self.func
    136 try:
--> 137     return next(self.gen)
    138 except StopIteration:
    139     raise RuntimeError("generator didn't yield") from None

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\file_manager.py:199, in CachingFileManager.acquire_context(self, needs_lock)
    196 @contextlib.contextmanager
    197 def acquire_context(self, needs_lock=True):
    198     """Context manager for acquiring a file."""
--> 199     file, cached = self._acquire_with_cache_info(needs_lock)
    200     try:
    201         yield file

File c:\Users\*****\AppData\Local\Programs\Python\Python312\Lib\site-packages\xarray\backends\file_manager.py:217, in CachingFileManager._acquire_with_cache_info(self, needs_lock)
    215     kwargs = kwargs.copy()
    216     kwargs["mode"] = self._mode
--> 217 file = self._opener(*self._args, **kwargs)
    218 if self._mode == "w":
    219     # ensure file doesn't get overridden when opened again
    220     self._mode = "a"

File src\\netCDF4\\_netCDF4.pyx:2521, in netCDF4._netCDF4.Dataset.__init__()

File src\\netCDF4\\_netCDF4.pyx:2158, in netCDF4._netCDF4._ensure_nc_success()

**OSError: [Errno -51] NetCDF: Unknown file format: 'c:\\dev\\weather\\era5_july2024_global_hourly.nc'**

</pre>
</details>
</div>

I should be crying (did) but I thought "maybe the download got corrupted". So I tried about thrice just to make sure... But that wasn't it. 

So the thing is- **This did not happen with the original test dataset**. Which troubled me to no end. I speculated that one of the variables messed up the data, so after several tries selectively removing and downloading and testing, I narrowed the suspect down to **Total Percipitation (tp)**. (This did take a lot of time as the datasets weren't small ~19GB).
  
Then I noticed that the ERA5 website says that the NetCDF version is "experimental". So I switched over to the **GRIB** format. 
Quite conviniently a library called `cfgrib` is available, and also works with xarray.

So I tried again with the GRIB version:   

```python
import xarray as xr
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt
import cfgrib

grib_ds = xr.open_dataset("era5_july2024_global_hourly.grib", engine="cfgrib")
grib_ds
```

It didn't work, But more importantly it showed something really insightful:

<div class="error-block">
<details>
<summary>Skipping variable: paramId==228 shortName='tp'</summary>
<pre>
skipping variable: paramId==228 shortName='tp'
Traceback (most recent call last):
  File "c:\Users\*****\anaconda3\envs\era5_env\Lib\site-packages\cfgrib\dataset.py", line 725, in build_dataset_components
    dict_merge(variables, coord_vars)
  File "c:\Users\*****\anaconda3\envs\era5_env\Lib\site-packages\cfgrib\dataset.py", line 641, in dict_merge
    raise DatasetBuildError(
cfgrib.dataset.DatasetBuildError: key present and new value is different: key='time' value=Variable(dimensions=('time',), data=array([1719792000, 1719795600, 1719799200, 1719802800, 1719806400,
       1719810000, 1719813600, 1719817200, 1719820800, 1719824400,
       1719828000, 1719831600, 1719835200, 1719838800, 1719842400,
       1719846000, 1719849600, 1719853200, 1719856800, 1719860400,
       1719864000, 1719867600, 1719871200, 1719874800, 1719878400,
       1719882000, 1719885600, 1719889200, 1719892800, 1719896400,
       1719900000, 1719903600, 1719907200, 1719910800, 1719914400,
       1719918000, 1719921600, 1719925200, 1719928800, 1719932400,
       1719936000, 1719939600, 1719943200, 1719946800, 1719950400,
       1719954000, 1719957600, 1719961200, 1719964800, 1719968400,
       1719972000, 1719975600, 1719979200, 1719982800, 1719986400,
       1719990000, 1719993600, 1719997200, 1720000800, 1720004400,
       1720008000, 1720011600, 1720015200, 1720018800, 1720022400,
       1720026000, 1720029600, 1720033200, 1720036800, 1720040400,
       1720044000, 1720047600, 1720051200, 1720054800, 1720058400,
       1720062000, 1720065600, 1720069200, 1720072800, 1720076400,
       1720080000, 1720083600, 1720087200, 1720090800, 1720094400,
       1720098000, 1720101600, 1720105200, 1720108800, 1720112400,
       1720116000, 1720119600, 1720123200, 1720126800, 1720130400,
       1720134000, 1720137600, 1720141200, 1720144800, 1720148400,
       1720152000, 1720155600, 1720159200, 1720162800, 1720166400,
       1720170000, 1720173600, 1720177200, 1720180800, 1720184400,
       1720188000, 1720191600, 1720195200, 1720198800, 1720202400,
       1720206000, 1720209600, 1720213200, 1720216800, 1720220400,
       1720224000, 1720227600, 1720231200, 1720234800, 1720238400,
       1720242000, 1720245600, 1720249200, 1720252800, 1720256400,
       1720260000, 1720263600, 1720267200, 1720270800, 1720274400,
       1720278000, 1720281600, 1720285200, 1720288800, 1720292400,
       1720296000, 1720299600, 1720303200, 1720306800, 1720310400,
       1720314000, 1720317600, 1720321200, 1720324800, 1720328400,
       1720332000, 1720335600, 1720339200, 1720342800, 1720346400,
       1720350000, 1720353600, 1720357200, 1720360800, 1720364400,
       1720368000, 1720371600, 1720375200, 1720378800, 1720382400,
       1720386000, 1720389600, 1720393200, 1720396800, 1720400400,
       1720404000, 1720407600, 1720411200, 1720414800, 1720418400,
       1720422000, 1720425600, 1720429200, 1720432800, 1720436400,
       1720440000, 1720443600, 1720447200, 1720450800, 1720454400,
       1720458000, 1720461600, 1720465200, 1720468800, 1720472400,
       1720476000, 1720479600, 1720483200, 1720486800, 1720490400,
       1720494000, 1720497600, 1720501200, 1720504800, 1720508400,
       1720512000, 1720515600, 1720519200, 1720522800, 1720526400,
       1720530000, 1720533600, 1720537200, 1720540800, 1720544400,
       1720548000, 1720551600, 1720555200, 1720558800, 1720562400,
       1720566000, 1720569600, 1720573200, 1720576800, 1720580400,
       1720584000, 1720587600, 1720591200, 1720594800, 1720598400,
       1720602000, 1720605600, 1720609200, 1720612800, 1720616400,
       1720620000, 1720623600, 1720627200, 1720630800, 1720634400,
       1720638000, 1720641600, 1720645200, 1720648800, 1720652400,
       1720656000, 1720659600, 1720663200, 1720666800, 1720670400,
       1720674000, 1720677600, 1720681200, 1720684800, 1720688400,
       1720692000, 1720695600, 1720699200, 1720702800, 1720706400,
       1720710000, 1720713600, 1720717200, 1720720800, 1720724400,
       1720728000, 1720731600, 1720735200, 1720738800, 1720742400,
       1720746000, 1720749600, 1720753200, 1720756800, 1720760400,
       1720764000, 1720767600, 1720771200, 1720774800, 1720778400,
       1720782000, 1720785600, 1720789200, 1720792800, 1720796400,
       1720800000, 1720803600, 1720807200, 1720810800, 1720814400,
       1720818000, 1720821600, 1720825200, 1720828800, 1720832400,
       1720836000, 1720839600, 1720843200, 1720846800, 1720850400,
       1720854000, 1720857600, 1720861200, 1720864800, 1720868400,
       1720872000, 1720875600, 1720879200, 1720882800, 1720886400,
       1720890000, 1720893600, 1720897200, 1720900800, 1720904400,
       1720908000, 1720911600, 1720915200, 1720918800, 1720922400,
       1720926000, 1720929600, 1720933200, 1720936800, 1720940400,
       1720944000, 1720947600, 1720951200, 1720954800, 1720958400,
       1720962000, 1720965600, 1720969200, 1720972800, 1720976400,
       1720980000, 1720983600, 1720987200, 1720990800, 1720994400,
       1720998000, 1721001600, 1721005200, 1721008800, 1721012400,
       1721016000, 1721019600, 1721023200, 1721026800, 1721030400,
       1721034000, 1721037600, 1721041200, 1721044800, 1721048400,
       1721052000, 1721055600, 1721059200, 1721062800, 1721066400,
       1721070000, 1721073600, 1721077200, 1721080800, 1721084400,
       1721088000, 1721091600, 1721095200, 1721098800, 1721102400,
       1721106000, 1721109600, 1721113200, 1721116800, 1721120400,
       1721124000, 1721127600, 1721131200, 1721134800, 1721138400,
       1721142000, 1721145600, 1721149200, 1721152800, 1721156400,
       1721160000, 1721163600, 1721167200, 1721170800, 1721174400,
       1721178000, 1721181600, 1721185200, 1721188800, 1721192400,
       1721196000, 1721199600, 1721203200, 1721206800, 1721210400,
       1721214000, 1721217600, 1721221200, 1721224800, 1721228400,
       1721232000, 1721235600, 1721239200, 1721242800, 1721246400,
       1721250000, 1721253600, 1721257200, 1721260800, 1721264400,
       1721268000, 1721271600, 1721275200, 1721278800, 1721282400,
       1721286000, 1721289600, 1721293200, 1721296800, 1721300400,
       1721304000, 1721307600, 1721311200, 1721314800, 1721318400,
       1721322000, 1721325600, 1721329200, 1721332800, 1721336400,
       1721340000, 1721343600, 1721347200, 1721350800, 1721354400,
       1721358000, 1721361600, 1721365200, 1721368800, 1721372400,
       1721376000, 1721379600, 1721383200, 1721386800, 1721390400,
       1721394000, 1721397600, 1721401200, 1721404800, 1721408400,
       1721412000, 1721415600, 1721419200, 1721422800, 1721426400,
       1721430000, 1721433600, 1721437200, 1721440800, 1721444400,
       1721448000, 1721451600, 1721455200, 1721458800, 1721462400,
       1721466000, 1721469600, 1721473200, 1721476800, 1721480400,
       1721484000, 1721487600, 1721491200, 1721494800, 1721498400,
       1721502000, 1721505600, 1721509200, 1721512800, 1721516400,
       1721520000, 1721523600, 1721527200, 1721530800, 1721534400,
       1721538000, 1721541600, 1721545200, 1721548800, 1721552400,
       1721556000, 1721559600, 1721563200, 1721566800, 1721570400,
       1721574000, 1721577600, 1721581200, 1721584800, 1721588400,
       1721592000, 1721595600, 1721599200, 1721602800, 1721606400,
       1721610000, 1721613600, 1721617200, 1721620800, 1721624400,
       1721628000, 1721631600, 1721635200, 1721638800, 1721642400,
       1721646000, 1721649600, 1721653200, 1721656800, 1721660400,
       1721664000, 1721667600, 1721671200, 1721674800, 1721678400,
       1721682000, 1721685600, 1721689200, 1721692800, 1721696400,
       1721700000, 1721703600, 1721707200, 1721710800, 1721714400,
       1721718000, 1721721600, 1721725200, 1721728800, 1721732400,
       1721736000, 1721739600, 1721743200, 1721746800, 1721750400,
       1721754000, 1721757600, 1721761200, 1721764800, 1721768400,
       1721772000, 1721775600, 1721779200, 1721782800, 1721786400,
       1721790000, 1721793600, 1721797200, 1721800800, 1721804400,
       1721808000, 1721811600, 1721815200, 1721818800, 1721822400,
       1721826000, 1721829600, 1721833200, 1721836800, 1721840400,
       1721844000, 1721847600, 1721851200, 1721854800, 1721858400,
       1721862000, 1721865600, 1721869200, 1721872800, 1721876400,
       1721880000, 1721883600, 1721887200, 1721890800, 1721894400,
       1721898000, 1721901600, 1721905200, 1721908800, 1721912400,
       1721916000, 1721919600, 1721923200, 1721926800, 1721930400,
       1721934000, 1721937600, 1721941200, 1721944800, 1721948400,
       1721952000, 1721955600, 1721959200, 1721962800, 1721966400,
       1721970000, 1721973600, 1721977200, 1721980800, 1721984400,
       1721988000, 1721991600, 1721995200, 1721998800, 1722002400,
       1722006000, 1722009600, 1722013200, 1722016800, 1722020400,
       1722024000, 1722027600, 1722031200, 1722034800, 1722038400,
       1722042000, 1722045600, 1722049200, 1722052800, 1722056400,
       1722060000, 1722063600, 1722067200, 1722070800, 1722074400,
       1722078000, 1722081600, 1722085200, 1722088800, 1722092400,
       1722096000, 1722099600, 1722103200, 1722106800, 1722110400,
       1722114000, 1722117600, 1722121200, 1722124800, 1722128400,
       1722132000, 1722135600, 1722139200, 1722142800, 1722146400,
       1722150000, 1722153600, 1722157200, 1722160800, 1722164400,
       1722168000, 1722171600, 1722175200, 1722178800, 1722182400,
       1722186000, 1722189600, 1722193200, 1722196800, 1722200400,
       1722204000, 1722207600, 1722211200, 1722214800, 1722218400,
       1722222000, 1722225600, 1722229200, 1722232800, 1722236400,
       1722240000, 1722243600, 1722247200, 1722250800, 1722254400,
       1722258000, 1722261600, 1722265200, 1722268800, 1722272400,
       1722276000, 1722279600, 1722283200, 1722286800, 1722290400,
       1722294000, 1722297600, 1722301200, 1722304800, 1722308400,
       1722312000, 1722315600, 1722319200, 1722322800, 1722326400,
       1722330000, 1722333600, 1722337200, 1722340800, 1722344400,
       1722348000, 1722351600, 1722355200, 1722358800, 1722362400,
       1722366000, 1722369600, 1722373200, 1722376800, 1722380400,
       1722384000, 1722387600, 1722391200, 1722394800, 1722398400,
       1722402000, 1722405600, 1722409200, 1722412800, 1722416400,
       1722420000, 1722423600, 1722427200, 1722430800, 1722434400,
       1722438000, 1722441600, 1722445200, 1722448800, 1722452400,
       1722456000, 1722459600, 1722463200, 1722466800])) new_value=Variable(dimensions=('time',), data=array([1719770400, 1719813600, 1719856800, 1719900000, 1719943200,
       1719986400, 1720029600, 1720072800, 1720116000, 1720159200,
       1720202400, 1720245600, 1720288800, 1720332000, 1720375200,
       1720418400, 1720461600, 1720504800, 1720548000, 1720591200,
       1720634400, 1720677600, 1720720800, 1720764000, 1720807200,
       1720850400, 1720893600, 1720936800, 1720980000, 1721023200,
       1721066400, 1721109600, 1721152800, 1721196000, 1721239200,
       1721282400, 1721325600, 1721368800, 1721412000, 1721455200,
       1721498400, 1721541600, 1721584800, 1721628000, 1721671200,
       1721714400, 1721757600, 1721800800, 1721844000, 1721887200,
       1721930400, 1721973600, 1722016800, 1722060000, 1722103200,
       1722146400, 1722189600, 1722232800, 1722276000, 1722319200,
       1722362400, 1722405600, 1722448800]))
</pre>
</details>
</div>

That was it! it was `tp`. Furthermore, it showed me exactly why the data was different. It is because the **timestamps are different**. `tp` was different from the other variables, which made the dataset heterogenous and xarray was unable to load it. (xarray always assumes homogenous data, tried to merge it, and failed).
So what do we do? After some searching I realised that cfgrib has its own load function that can auto-detect the different datasets present in the file. Something like this:

```python
import xarray as xr
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt
import cfgrib

dataset = cfgrib.open_datasets("era5_july2024_global_hourly.grib")
ds1 = dataset[0]
ds2 = dataset[1]

```

No Errors! Finally. There were infact two datasets in that file.




