var infoboard_Instance;

L.Control.switchIcon = L.Control.extend({
    options:{
        position:'topright',
    },
    onAdd: function(map) {
        this._map = map;
        this.icon_container = L.DomUtil.create('div','info-chart-button')
        this.icon_container.id = 'info_chart_btn'

        L.DomEvent.addListener(this.icon_container, 'click', L.DomEvent.stopPropagation)
        .addListener(this.icon_container, 'click', L.DomEvent.preventDefault)
        .addListener(this.icon_container, 'click', this.onBuildInfoBoard, this)
        .addListener(this.icon_container, 'click', function(){
            map.doubleClickZoom.disable();
            map.once('click', function (e) { 
                map.doubleClickZoom.enable();
            });
        });

        return this.icon_container;
    },

    onBuildInfoBoard: function() {
        if(!infoboard_Instance){
            var board = new L.Control.InfoBoard();
            this._map.addControl(board);
            infoboard_Instance = board;
        }else {
            this._map.removeControl(infoboard_Instance);
            infoboard_Instance = null;
        }
        
    }
});

L.Control.InfoBoard = L.Control.extend({
    options:{
        position: 'topright'
    },
    onAdd: function(map){
        var board_div = L.DomUtil.create('div','info-board-container');
        this._boardContainer = board_div;
        L.DomEvent.addListener(this._boardContainer, 'click', L.DomEvent.stopPropagation)
        .addListener(this._boardContainer, 'click', L.DomEvent.preventDefault)
        // .addListener(this.drawer_container, 'dbclick', L.DomEvent.stopPropagation)
        // .addListener(this.drawer_container, 'dbclick', L.DomEvent.preventDefault)
        
        this._initContent();
        return this._boardContainer;
    },
    _initContent: function(){
        //var shrimpLogo = L.DomUtil.create('div','info-shrimpLogo');
        var aboutInfo = L.DomUtil.create('div','info-about');
        //aboutInfo.innerHTML = "<h4 style='color: blue;text-decoration:underline'>About Info</h4>";
		aboutInfo.innerHTML = "<div class='pond-on-about'></div>";   // HM 20200206 
        aboutInfo.innerHTML += '<div><p>Produced by Clark Labs under a grant from the Gordon and Betty Moore Foundation. The purpose of the site is to support the Moore Foundation’s Ocean and Seafood Markets Initiative, and the work of its partner organizations. Critical land covers being monitored are pond aquaculture, in a coastal zone thought to be most conductive to brackish water cultivation (e.g., shrimp), mangroves and other coastal wetlands.</p></div>';
		aboutInfo.innerHTML += '<div><p>Three dates have been mapped to date: 1999, 2014 and 2018. 1999 was chosen because of its critical role in the sustainability certification process for farms under the Aquaculture Stewardship Council’s Shrimp Standard version 1.1.<p></div>';
		aboutInfo.innerHTML += '<div><p>The land cover maps are based on Landsat 5 for 1999 and Landsat 8 imagery for 2014 and 2018. All Landsat data were upsampled to 15 m and substituted with pan-merged bands where appropriate. Additional data included SRTM elevations, Tasseled Cap transformed images and multiple convolutions of reflectance data. Classifications were performed using a Multi-Layer Perceptron neural network for pond aquaculture and open water, and Mahalanobis Typicality for the remaining classes.</p></div>';
        //this._boardContainer.appendChild(shrimpLogo);
        this._boardContainer.appendChild(aboutInfo);


    }
})