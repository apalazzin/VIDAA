import React, { Component } from 'react';
import dat from "./../../../libs/dat.gui.min.js";

import {
    obtainBlobUrl,
    initScene,
    loadStl,
    clippingLAA,
    renderView
} from './pl_component_viewer_LAAO_implantation_with_clipping';

import {
    load_centreline
} from './../pl_component_viewer_LAAO_implantation/pl_component_viewer_LAAO_implantation_actions';

import {
    ampl_device_selection,
    wat_device_selection
} from './pl_component_viewer_LAAO_selection';

import {
    load_ampl_AMULET,
    load_Watchman
} from './pl_component_viewer_LAAO_loading';

import{
    placeGUI
}from './pl_component_viewer_LAAO_implantation_actions_gui';

export class PlComponentViewerLAAOImplantationWithClipping extends Component {

    componentDidMount() {
        var myComponent = this;

        var mesh = this.props.mesh;
        var center_line = this.props.center_line;
        var measurements = this.props.measurements;

        initScene(function (data) {

            var url_mesh = obtainBlobUrl(mesh);
            var url_centreline = obtainBlobUrl(center_line);

            var scene = data.scene;
            var camera = data.camera;
            var renderer = data.renderer;
            var control = data.control;
            loadStl(scene, url_mesh, function (data) {
                var mesh = data.mesh;
                var boxcenterLA = data.boxcenterLA;

                load_centreline(scene, url_centreline, mesh, boxcenterLA, function (device_selection_data) {
                    clippingLAA(device_selection_data, mesh, scene, camera, renderer, function (result) {
                        // LAAO device selection
                        var ampl_selected = ampl_device_selection(measurements, device_selection_data.ampl);
                        var wat_selected = wat_device_selection(measurements, device_selection_data.wat);

                        var ampl_path = ["./Ampl_std_mesh/9-ACP2-007-016.stl",
                            "./Ampl_std_mesh/9-ACP2-007-018.stl",
                            "./Ampl_std_mesh/9-ACP2-007-020.stl",
                            "./Ampl_std_mesh/9-ACP2-007-022.stl",
                            "./Ampl_std_mesh/9-ACP2-010-025.stl",
                            "./Ampl_std_mesh/9-ACP2-010-028.stl",
                            "./Ampl_std_mesh/9-ACP2-010-031.stl",
                            "./Ampl_std_mesh/9-ACP2-010-034.stl"];

                        var AMPL_gui_data = {};
                        AMPL_gui_data["visibility"] = [];
                        AMPL_gui_data.visibility[0] = {
                            "Ampl. 16": false
                        };
                        AMPL_gui_data.visibility[1] = {
                            "Ampl. 18": false
                        };
                        AMPL_gui_data.visibility[2] = {
                            "Ampl. 20": false
                        };
                        AMPL_gui_data.visibility[3] = {
                            "Ampl. 22": false
                        };
                        AMPL_gui_data.visibility[4] = {
                            "Ampl. 25": false
                        };
                        AMPL_gui_data.visibility[5] = {
                            "Ampl. 28": false
                        };
                        AMPL_gui_data.visibility[6] = {
                            "Ampl. 31": false
                        };
                        AMPL_gui_data.visibility[7] = {
                            "Ampl. 34": false
                        };

                        AMPL_gui_data["text"] = ["Ampl. 16",
                            "Ampl. 18",
                            "Ampl. 20",
                            "Ampl. 22",
                            "Ampl. 25",
                            "Ampl. 28",
                            "Ampl. 31",
                            "Ampl. 34"
                        ];

                        var gui_devices = new dat.GUI();
                        placeGUI(gui_devices);
                        var amplatzer_folder = gui_devices.addFolder('Amplatzer AMULET');
                        var watchman_folder = gui_devices.addFolder('Watchman');


                        var ampl_names = [];
                        for (var i = 0; i <= ampl_selected.length - 1; i++) {
                            ampl_names[i] = AMPL_gui_data.text[ampl_selected[i]];
                        };

                        myComponent.setState({
                            ampl: ampl_names
                        });

                        for (var i = 0; i <= ampl_selected.length - 1; i++) {
                            load_ampl_AMULET(ampl_path[ampl_selected[i]], device_selection_data.ampl, mesh,
                                scene, AMPL_gui_data.text[ampl_selected[i]],
                                AMPL_gui_data.visibility[ampl_selected[i]], amplatzer_folder, ampl_names, renderView, control,function (ampl) {
                                    
                                });
                        }

                        var wat_path = ["./Watchman/watchman_21.stl",
                            "./Watchman/watchman_24.stl",
                            "./Watchman/watchman_27.stl",
                            "./Watchman/watchman_30.stl",
                            "./Watchman/watchman_33.stl"];

                        var Wat_gui_data = {};
                        Wat_gui_data["visibility"] = [];
                        Wat_gui_data.visibility[0] = {
                            "Wat. 21": false
                        };
                        Wat_gui_data.visibility[1] = {
                            "Wat. 24": false
                        };
                        Wat_gui_data.visibility[2] = {
                            "Wat. 27": false
                        };
                        Wat_gui_data.visibility[3] = {
                            "Wat. 30": false
                        };
                        Wat_gui_data.visibility[4] = {
                            "Wat. 33": false
                        };

                        Wat_gui_data["text"] = ["Wat. 21",
                            "Wat. 24",
                            "Wat. 27",
                            "Wat. 30",
                            "Wat. 33"
                        ];
                        var wat_names = [];
                        for (var i = 0; i <= wat_selected.length - 1; i++) {
                            wat_names[i] = Wat_gui_data.text[wat_selected[i]];
                        };
                        myComponent.setState({
                            wat: wat_names
                        });
                        for (var i = 0; i <= wat_selected.length - 1; i++) {
                            load_Watchman(wat_path[wat_selected[i]], device_selection_data.wat, mesh, scene, Wat_gui_data.text[wat_selected[i]],
                                Wat_gui_data.visibility[wat_selected[i]], watchman_folder, renderView, control,function (wat) {

                                });
                        };

                    });

                });
            });
        });
}


set_action(action) {

    console.log("Set action");

    var father_component = this.props.this;

    if (action === "go_back") {

        father_component.setState({
            go_back: true,
            data_view: false,
          //  clipping: false,
            implantation: false,
        });

    } else if (action === "data_view") {

        father_component.setState({
            go_back: false,
            data_view: true,
           // clipping: false,
            implantation: false,
        });

    } /*else if (action === "clipping") {

        father_component.setState({
            go_back: false,
            data_view: false,
            clipping: true,
            implantation: false,
        });

    } */else if (action === "implantation") {

        father_component.setState({
            go_back: false,
            data_view: false,
            //clipping: false,
            implantation: true,
        });
    }
}

render_toolbar() {

    return (

        <div className="grid-block">
            <a onClick={this.set_action.bind(this, "go_back")}>Home</a>
            <a onClick={this.set_action.bind(this, "data_view")}>Data View</a>
            {/*<a onClick={this.set_action.bind(this, "clipping")}>Clipping View</a>*/}
            <a class="active" onClick={this.set_action.bind(this, "implantation")}>LAAO Implantation</a>
        </div>

    );

}

render() {

    return (

        <div className="vertical grid-block pl-component-viewer-LAAO-implantation">
            <div className="grid-block body">
                <div clasName="grid-block container-viewer" id="container-viewer">
                </div>
                <div className="container-gui-menu" id="container-gui-menu" ></div>
            </div>
            <div className="grid-block toolbar shrink">
                {this.render_toolbar()}
            </div>
        </div>

    );
}
}