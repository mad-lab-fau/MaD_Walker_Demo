function Data() {
    console.log('test: in Data');
    this.headers = new Array('Node', 'Time', 'Trunk_CM_x', 'Trunk_CM_y', 'Hip_x', 'Hip_y', 'R_knee_x', 'R_knee_y', 'R_ankle_x', 'R_ankle_y', 'R_CP_01_x', 'R_CP_01_y', 'R_CP_02_x', 'R_CP_02_y', 'L_knee_x', 'L_knee_y', 'L_ankle_x', 'L_ankle_y', 'L_CP_01_x', 'L_CP_01_y', 'L_CP_02_x', 'L_CP_02_y', 'R_CP_woDef_01_x', 'R_CP_woDef_01_y', 'R_CP_woDef_02_x', 'R_CP_woDef_02_y', 'L_CP_woDef_01_x', 'L_CP_woDef_01_y', 'L_CP_woDef_02_x', 'L_CP_woDef_02_y');
    this.nNodes = 2; // Change later
    this.testData = new Array(this.nNodes);
    this.testData[0] = new Array(1, 0, 0.07478, 1.2759, 0, 0.96757, 0.19213, 0.5679, 0.25816, 0.12756, 0.1988, 0.056567, 0.42389, 0.059726, -0.10561, 0.53688, -0.49441, 0.31987, -0.57156, 0.37099, -0.54339, 0.14766, 0.19882, 0.056524, 0.42392, 0.059685, -0.57161, 0.37095, -0.54344, 0.1476);


}

Data.prototype.constructor = Data;