var drawer_Instance;
var polyline;
var markers = {};
var Forms = 1;
var bug;

L.Control.showDrawer = L.Control.extend({
    options:{
        position: 'topright',
    },
    onAdd: function(map) {
        this._map = map;
        this.drawer_container = L.DomUtil.create('div','drawer-button')
        bug = this.drawer_container

        L.DomEvent.addListener(this.drawer_container, 'click', L.DomEvent.stopPropagation)
        .addListener(this.drawer_container, 'click', L.DomEvent.preventDefault)
        .addListener(this.drawer_container, 'click', this.onBuildDrawer, this)
        .addListener(this.drawer_container, 'click', function(){
            map.doubleClickZoom.disable();
            map.once('click', function (e) { 
                map.doubleClickZoom.enable();
            });
        });

        return this.drawer_container;
    },

    onBuildDrawer: function() {
        if(!drawer_Instance){
            var drawer = new L.Control.Drawer();
            this._map.addControl(drawer);
            Forms = 1;

            drawer_Instance = drawer;
        }else{
            this._map.removeControl(drawer_Instance);
            drawer_Instance = null;
        }
    },
});

L.Control.Drawer = L.Control.extend({
    options:{
        position: 'topright'
    },
    onAdd: function(map){
        this._map = map;
        var drawer_div = L.DomUtil.create('div','drawer-container');
        this._container = drawer_div;
        L.DomEvent.addListener(this._container, 'click', L.DomEvent.stopPropagation)
            .addListener(this._container, 'click', L.DomEvent.preventDefault)
        
        this._initLayout();

        return this._container; 
    },
    _initLayout: function() {
        var drawer_title = L.DomUtil.create('p','drawer-title');
        
        drawer_title.innerHTML += "<p class='drawer-title-customize'>Location Drawer</p>";
        drawer_title.innerHTML +="<p>Please input coordinates in order</p>"
        this._container.appendChild(drawer_title);

        // initiate latlng container
        var drawer_main = L.DomUtil.create('div','drawer-main');
        this._container.appendChild(drawer_main);
        this._initMain(drawer_main);

        // initiate the finish button
        var finish_container = L.DomUtil.create('div','finish-container');
        this._container.appendChild(finish_container);
        this._initFinishbtn(finish_container);

        // initiate clear all button
        var clear_container = L.DomUtil.create('div','clear-container');
        this._container.appendChild(clear_container);
        this._initClear(clear_container);


        this._latlng_container = drawer_main;
        // this._addbtn_container = addbtn_container;
        this._finish_container = finish_container;


    },
    _initAddbtn: function(container) {
        var drawer_addbtn = L.DomUtil.create('button','drawer-addbtn');
        drawer_addbtn.innerHTML += "<span><i class='fas fa-plus'></i></span>";
        container.appendChild(drawer_addbtn);

        this._drawer_addbtn = drawer_addbtn;
        // console.log(this)
        var that = this;
        L.DomEvent.addListener(this._drawer_addbtn,'click', function(){
            that._onBuildForms()
        })

    },
    _initFinishbtn: function(container) {
        var drawer_finishbtn = L.DomUtil.create('button','drawer-finishbtn');
        drawer_finishbtn.innerHTML += "<span><i class='fas fa-check'></i></span>"
        container.appendChild(drawer_finishbtn);

        var that = this;
        L.DomEvent.addListener(drawer_finishbtn, 'click', function(){
            var formInfo = {};
            $('form').each(function(){
                // console.log(this.id)
                var formId = this.id;
                formInfo[formId] = [parseFloat(this.children[1].value),parseFloat(this.children[3].value)]
            })

            // process coordinate data here!!!!
            if(formInfo!=null){
                if(Object.getOwnPropertyNames(markers).length!=0) {
                    for(item in markers){
                        markers[item].remove()
                    }
                    if(polyline!=null){polyline.remove()}
                    formInfo = that._cleanForminfo(formInfo)
                    that._draw(formInfo)
                }else {
                    formInfo = that._cleanForminfo(formInfo)
                    // console.log('data ready for draw',formInfo)
                    // bug = formInfo
                    that._draw(formInfo)
                }
                
            }else {
                // do nothing
            }
            
        })


    },
    _initClear: function(container) {
        var drawer_clearbtn = L.DomUtil.create('button','drawer-clearbtn');
        drawer_clearbtn.innerHTML += "<span><i class='fas fa-trash'></i></span>";
        container.appendChild(drawer_clearbtn);

        this._drawer_clearbtn = drawer_clearbtn;

        var that = this;
        L.DomEvent.addListener(this._drawer_clearbtn,'click', function(){
            for(x in markers){
                markers[x].remove()
            }
            if(polyline!=null){
                polyline.remove() 
            }
            // no need to clear markers{}, it will be reset anyway
        })

    },
    _initMain: function(container) {
        var form = L.DomUtil.create('form','drawer-form form-inline');
        form.id = "form_0"

        content = "<label for='lat' >Lat:</label>" +
                "<input class='input-latlng' type='text' id='lat' placeholder='Enter Latitude' name='latitude'>" +
                "<label for='lng' >Lng:</label>" +
                "<input class='input-latlng' type='text' id='lng' placeholder='Enter Longitude'name='longitude'>" 

        form.innerHTML = content;

        this._initAddbtn(form);

        container.appendChild(form);
        
    },
    _onBuildForms: function() {
        this._appendForm(this._latlng_container)
    },
    _createForm: function() {
        var form = L.DomUtil.create('form','drawer-form form-inline');
        form.id = 'form_' + Forms;

        content = "<label for='lat'>Lat:</label>" +
                "<input class='input-latlng' type='text' id='lat' placeholder='Enter latitude' name='latitude'>" +
                "<label for='lng'>Lng:</label>" +
                "<input class='input-latlng' type='text' id='lng' placeholder='Enter longitude'name='longitude'>"

        form.innerHTML = content;

        var delButton = L.DomUtil.create('button','form-delete');
        delButton.innerHTML +=  "<span><i class='fas fa-minus'></i></span>"
        delButton.id = 'delBtn_' + Forms
        form.appendChild(delButton);

        var that = this;
        L.DomEvent.addListener(delButton, 'click', function(){
            delForm_id = 'form_' + delButton.id.substr(-1);
            delForm = document.getElementById(delForm_id);
            that._latlng_container.removeChild(delForm);
            // console.log("deleting form : ", delForm)
            if(markers[delForm_id]!=null) {
                markers[delForm_id].remove()
            }else {
                // just remove the empty form
            }
        })

        return form;
    },
    _appendForm: function(container) {
        var tempForm = this._createForm()
        container.appendChild(tempForm);

        Forms += 1;
    },
    _cleanForminfo: function(forminfo){
        // get rid of NaN value
        for(item in forminfo) {
            if(forminfo[item].includes(NaN)==true) {
                delete forminfo[item]
            }
        }

        return forminfo;
    },
    _draw: function(data){
        if(Object.getOwnPropertyNames(data).length<=2){
            for(item in data) {

                var point = L.marker(data[item]);
                point.addTo(this._map);
                markers[item] = point;
            }
        }else {
            var latlngs = [];
            for(item in data) {
                latlngs.push(data[item])
            }
            latlngs.push(latlngs[0])
            polyline = L.polyline(latlngs, {color: 'red'}).addTo(this._map);
        }

    }

})