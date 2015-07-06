module.exports = function (grunt) {
    grunt.registerTask('update_from_idt', function () {

        var pkg         = grunt.file.readJSON('package.json')
        var http        = require('http');
        var fs          = require('fs');
        var done = this.async();
        
        grunt.log.writeln('Changing');
        
        getDataFromIDT(function (data) {
            var jihadArray = convertDataToArray(data);
            var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var outputFiles = {
                'list_dead': '',
                'list_conficted': '',
                'list_alive': '',
                'portraits_dead': '',
                'portraits_conficted': '',
                'portraits_alive': ''
            }
            jihadArray.forEach(function (jihad) {
                jihad = transformJihad(jihad); 

                var dateOfDeath,
                    ageText,
                    liClassNames,
                    month,
                    dod,
                    dateOfDeathConviction,
                    groupOffences,
                    groupOffenceNames,
                    groupMarkup;

                
                if (jihad.category === 'dead') {
                    dateOfDeathText = 'Date of death';
                    ageText = 'Age';
                    liClassNames = 'ns_facewall__item--' + jihad.age + ' ns_facewall__item--hometown-' + jihad.hometown;
                    month = (jihad.month_killed) ? months[parseInt(jihad.month_killed, 10)] : '';
                    dod = month + ' ' + jihad.year_killed;
                    dateOfDeathConviction = (dod.trim() !== '') ? dod : 'Unconfirmed';
                    groupOffences = 'Group';
                    groupOffenceNames = (jihad.group) ? jihad.group : 'Unconfirmed';
                    groupMarkup = '<span class="ns_facewall__group portrait__atrribute">' + groupOffences + ': ' + groupOffenceNames + '</span>' 
                }

                outputFiles['list_' + jihad.category] += '' +
                '<li class="ns_facewall__item ' + liClassNames + ' ns_facewall__item--filtered">' +
                    '<a class="ns_facewall__thumb ns_facewall__thumb--' + jihad.thumbClassName + '" href="#ns_facewall--' + jihad.id + '"><span>' + jihad.name + '</span><span>Age: ' + jihad.ageValue + '</span></a>' +
                    '<div class="ns_facewall__tooltip">' +
                        '<span class="ns_facewall__tooltipname">' +jihad.name + '</span>' +
                    '</div>' +
                '</li>';
            });

            console.log(outputFiles.list_dead);

            done();
        });

        function transformJihad(jihad) {
            jihad.thumbClassName = (jihad.image === 'y') ? jihad.id : 'silhouette';
            jihad.name = jihad.name || 'Real name: Unconfirmed';
            jihad.aka = (jihad.aka) ? '<h3 class="ns_facewall__alias">Also known as: ' + jihad.aka + '</h3>' : '';
            jihad.ageValue = jihad.age || 'Unconfirmed';
            jihad.category = jihad.category.toLowerCase().trim(); 
            jihad.penportraitText = 'pp' + jihad.category;
            jihad.group = jihad.group.trim();
            jihad.hometown = jihad.hometown.toLowerCase();
            jihad.offences = jihad.offences.split(',');
            jihad.link = jihad.link.trim();
            jihad.headline = jihad.headline.trim();
            jihad.linkText = (jihad.link) ? '<a class="ns_facewall__storylink" href="' + jihad.link + '" target="ns__linkout">' + jihad.headline + '</a>' : '';
            
            if(jihad.age !== '') {
                if (jihad.age <= 20) {
                    jihad.age = 'age-17-20';
                } else if (jihad.age <= 25) {
                    jihad.age = 'age-21-25';
                } else if (jihad.age <= 30) {
                    jihad.age = 'age-26-30';
                } else if (jihad.age > 30) {
                    jihad.age = 'age-30';
                }
            } else {
                jihad.age = 'age-unknown';
            }

            
            return jihad; 
        }

        function convertDataToArray(data) {
            var returnArray = [];

            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    var item = data[prop];
                    item.order = prop;

                    returnArray.push(item);
                }
            }

            returnArray.sort(function(a, b) { return a.order - b.order; });

            return returnArray;
        }

        function getHttpOptions(request) {
            var options;
            var httpProxy = process.env.HTTP_PROXY;

            if (!httpProxy) {
                /* If we're off reith, do standard HTTP request */
                options = {
                    host: request['host'],
                    path: request['path'],
                };
            } else {
                /* If on reith, send request through the HTTP proxy */

                /* Regex to extract the host and port number of the HTTP_PROXY enviroment variable */
                var proxyDetails = httpProxy.match(/http:\/\/(.*):((?:[0-9])(?:[0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))/);
                options = {
                    host: proxyDetails[1],
                    port: proxyDetails[2],
                    path: 'http://' + request['host'] + request['path'],
                };
            }
            return options;
        };
    
        function getDataFromIDT(callback) {
            grunt.log.writeln('Got here');
            var request = {
                host: 'www.bbc.co.uk',
                path: '/indepthtoolkit/data_set/jhadi-facewall'
            }
            grunt.log.writeln(JSON.stringify(getHttpOptions(request)));
            http.request(getHttpOptions(request), function (res) {
                var str = '';

                res.on('data', function (chunk) {
                    str += chunk;
                });

                res.on('end', function (data) {
                   callback(JSON.parse(str)); 
                });
            }).end();
        };

    });
};
