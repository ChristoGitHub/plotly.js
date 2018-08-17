/**
* Copyright 2012-2018, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

var barHover = require('../bar/hover');
var makeHoverPointText = require('../scatterpolar/hover').makeHoverPointText;
var Axes = require('../../plots/cartesian/axes');
var Fx = require('../../components/fx');
var Lib = require('../../lib');

module.exports = function hoverPoints(pointData, xval, yval, hovermode) {
    var cd = pointData.cd;
    var trace = cd[0].trace;
    var t = cd[0].t;

    var subplot = pointData.subplot;
    var radialAxis = subplot.radialAxis;
    var angularAxis = subplot.angularAxis;
    var xa = subplot.xaxis;
    var ya = subplot.yaxis;

    var rVal = Math.sqrt(xval * xval + yval * yval);
    var thetaVal = Math.atan2(yval, xval);

    var distFn = function(di) {
        var rg = radialAxis.c2g(di.s);
        var thetag = angularAxis.c2g(Lib.deg2rad(Lib.wrap180(Lib.rad2deg(di.theta))));
        // console.log(di.p, rg, rVal)

        return Fx.inbox(rg - rVal, rVal - rg, 1)
    };

    Fx.getClosest(cd, distFn, pointData);

    // console.log(pointData.index)

    // skip the rest (for this trace) if we didn't find a close point
    if(pointData.index === false) return;

    var index = pointData.index;
    var cdi = cd[index];

    var rg = radialAxis.c2g(cdi.s);
    var thetag = angularAxis.c2g(cdi.p);
    var xp = xa.c2p(rg * Math.cos(thetag));
    var yp = ya.c2p(rg * Math.sin(thetag));

    pointData.x0 = pointData.x1 = xp;
    pointData.y0 = pointData.y1 = yp;

    console.log(xp, yp)

    pointData.xLabelVal = undefined;
    pointData.yLabelVal = undefined;
    pointData.extraText = makeHoverPointText(cdi, trace, subplot);

    return [pointData];
};
