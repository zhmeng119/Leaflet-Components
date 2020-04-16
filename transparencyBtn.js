var slider_Instance;
var bug;
var tooltip_Instance;

L.Control.transparencyBtn = L.Control.extend({
    options:{
        position:'topright',
    },
    onAdd: function(map) {
        this._map = map;
        this.transparency_container = L.DomUtil.create('div','transparency-button')
        this.transparency_container.id = 'transparency_btn'
        // bug = this.transparency_container

        L.DomEvent.addListener(this.transparency_container, 'click', L.DomEvent.stopPropagation)
        .addListener(this.transparency_container, 'click', L.DomEvent.preventDefault)
        .addListener(this.transparency_container, 'click', this.onBuildSlider, this)
        .addListener(this.transparency_container, 'mouseover',function(){

            mymap.dragging.disable()
        })
        .addListener(this.transparency_container, 'mouseout',function(){

            mymap.dragging.enable()
        })
        .addListener(this.transparency_container, 'click', function(){
            mymap.doubleClickZoom.disable();
            mymap.once('click', function (e) { 
                mymap.doubleClickZoom.enable();
            });
        });

        return this.transparency_container;
    },

    onBuildSlider: function() {
        if(currentLayer==null){
            if(!tooltip_Instance){
                this.tip_container = L.DomUtil.create('div','transparency-tip');
                this.tip_container.innerHTML = "<span id='close' onclick='this.parentNode.parentNode.removeChild(this.parentNode); tooltip_Instance = null;'>x</span>"
                this.tip_container.innerHTML += "<br><p class='text transparency-text'>No Layer Loaded</p>"
                tooltip_Instance = this.tip_container

                this.transparency_container.appendChild(this.tip_container)
                L.DomEvent.addListener(this.tip_container, 'click', L.DomEvent.stopPropagation)
                 .addListener(this.tip_container, 'click', L.DomEvent.preventDefault)
            }else{
                this._map.removeControl(tooltip_Instance);
                tooltip_Instance = null;
            }

            
        }else{
            if(!slider_Instance){
                var slider = new L.Control.Slider();
                this._map.addControl(slider);
                slider_Instance = slider;
                // document.getElementById('transparency_btn').style.backgroundColor='#e01a7d'
     
            }else{
                this._map.removeControl(slider_Instance);
                slider_Instance = null;
                // document.getElementById('transparency_btn').style.backgroundColor='#ffffff'
     
            }
        }

    }
})

L.Control.Slider = L.Control.extend({
    options:{
        position: 'topright'
    },
    onAdd: function(map) {
        this._map = map;

        var slider_div = L.DomUtil.create('div','transparency-slider');
        this._sliderDiv = slider_div;
        this._sliderDiv.id = 'sliderDiv';

        L.DomEvent.addListener(this._sliderDiv, 'click', L.DomEvent.stopPropagation)
        .addListener(this._sliderDiv, 'click', L.DomEvent.preventDefault);

        this._initSlider();

        return this._sliderDiv;
    },
    _initSlider: function() {
        console.log('this.............', this)
        var that = this;
        var slider_container = L.DomUtil.create('div','slider-container');
        this._sliderContainer = slider_container;
        L.DomEvent.addListener(this._sliderContainer, 'click', L.DomEvent.stopPropagation)
        .addListener(this._sliderContainer, 'click', L.DomEvent.preventDefault)
        .addListener(this._sliderContainer, 'mouseover',function(){
            mymap.dragging.disable()
        })
        .addListener(this._sliderContainer, 'mouseout',function(){
            mymap.dragging.enable()
        });
    

        var slider = document.createElement("input");
        slider.setAttribute("class", "");
        slider.setAttribute("id", "myRange");
        slider.setAttribute("type", "range");
        slider.setAttribute("min", "0");
        slider.setAttribute("max", "100");
        slider.setAttribute("value", currentOpacity);

        slider.style.cssText="height: 12px; width: 100%; border: 1px solid #808080; background: white;"+
        "opacity: 0.7; -webkit-appearance: none; outline: none;"

        this._sliderContainer.innerHTML = '<span style="font-size:100%;text-align:center;">Opacity</span>';
        this._sliderContainer.innerHTML += '<table style="font-size:100%;padding:0;margin:0"><tr><td style="text-align:left;" width="55%">0%</td><td  style="text-align:right;" align="right">100%</td></tr></table>'
        this._sliderContainer.appendChild(slider);
        this._sliderDiv.appendChild(this._sliderContainer)

        var display_value = L.DomUtil.create('div','display-value');
        display_value.innerHTML= currentOpacity + "%"
        this._sliderDiv.appendChild(display_value);

        L.DomEvent.addListener(slider, 'mouseover',function(){
            mymap.dragging.disable()
        })
        .addListener(slider, 'mouseout',function(){
            mymap.dragging.enable()
        });

        
        slider.oninput = function() {
            that._updateOpacity(this.value)
            console.log(this.value)
            display_value.innerHTML= this.value + "%"
        };

        mymap.on('layeradd',function(){
            that._updateOpacity(currentOpacity)
        })
        
    },
    _updateOpacity: function(value) {
        var opacityLayer = currentLayer;
        var uiValue = value/100;
        if(opacityLayer != undefined){
            opacityLayer.setOpacity(uiValue);
            currentOpacity = value;
        }else{
            // do nothing
        }
    }
});

