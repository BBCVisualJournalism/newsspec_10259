# Tracking Britain's jihadists
Tracking Britain's jihadists - http://www.bbc.co.uk/news/uk-32026985

## Getting started

### Set up the project

```
grunt
```

Make images responsive

```
grunt images
```

### Data

This Dataset is stored inside an [IDT dataset found here](https://production.live.bbc.co.uk/isite2-xforms/fr/indepthtoolkit/dataset/edit/f5f21b32-f8c8-4d6c-a3c7-4bb9c89dbe22) and the [JSON from the dataset can be found here](http://www.bbc.co.uk/indepthtoolkit/data_set/jhadi-facewall).

To update the data simply run:
```
grunt update_from_idt
```

You will then need to `grunt` again.

#### tasks/update_from_idt.js
This script is responsible for creating the following includes in the 'source/tmpl/facewall' directory;
* facewall markup i.e. source/tmpl/facewall/list_alive.tmpl
* facewall pen-portrait markup i.e. source/tmpl/facewall/portraits_alive.tmpl

This particular project has 3 different facewalls (alive, convicted, dead)

#### Profiles

There is a $totalProfiles count in main.scss which defines CSS background-position rules for all profiles.

If enough new profiles are added, you may need to update the `$totalProfiles` count. But this is unlikely as the number has been set to 220 (at time of writing) when only 179 profiles exist.

#### Versioning

You may need to push the version number of the project. Update the version number in the package file. Also update the version numbers to sprites in the following files.

source/scss/facewall.scss
source/scss/panel.scss

### Common requests
A filter is returning 0. This is because people have been removed
* Check the value of the tick box matches the name of the string in the spreadsheet. for instance if someone belonged to a group called "this is a group", the tick-box value would be
group-this-is-a-group

A new filter added to the dataset is not appearing in the filters for a given category
* manually add the filter and make sure the name follows the conventions as described below

### Filter naming conventions

the following code extract shows the structure of a filter
```html
<div>
    <label for="ns_facewall__input--group-nusra-front">Nusra Front</label>
    <input class="ns_facewall__input ns_facewall__input--group-nusra-front" value="group-nusra-front" type="checkbox" />
</div>
```

the value of the input checkbox is made up of the tab name (the column name) and the values all lowercased and spaces replaced with dashes (-)
i.e. for column name 'group' where a value for a group is Nusra Front, this would be represented as 'group-nusra-front'




## iFrame scaffold

This project was built using the iFrame scaffold v1.6.2

## License
Copyright (c) 2014 BBC
