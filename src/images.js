var extend = require("./utils").extend;
var parser = require("./parser");

var DEFAULT_QUALITY = 75;
var DEFAULT_US_RADIUS = 0.50;
var DEFAULT_US_THRESHOLD = 0.00;
var DEFAULT_US_AMOUNT = 0.20;
var DEFAULT_AUTO = "auto";

/**
 * This provides methods used for adjustment APIs. It's not meant to
 * be used directly.
 *
 * @mixin
 * @alias AdjustMixin
 */
function AdjustMixin(init) {
  this.adjustments = {};
  if (init !== undefined) {
    for (var a in init) {
      if (init.hasOwnProperty(a)) {
        this.adjustments[a] = init[a];
      }
    }
  }
}
AdjustMixin.prototype = {
  /**
   * brightness of the image. supports 'auto' or a numeric value between -100 and 100
   * @param {string|number} b a Number between -100 and 100 or 'auto'
   * @returns {*} the operation
   */
  brightness: function (b) {
    this.adjustments.br = b || DEFAULT_AUTO;
    return this;
  },
  /**
   * contrast of the image. supports 'auto' or a numeric value between -100 and 100
   * @param {string|number} c a Number between -100 and 100 or 'auto'
   * @returns {*} the operation
   */
  contrast: function (c) {
    this.adjustments.con = c || DEFAULT_AUTO;
    return this;
  },
  /**
   * saturation of the image. supports 'auto' or a numeric value between -100 and 100
   * @param {string|number} s a Number between -100 and 100 or 'auto'
   * @returns {*} the operation
   */
  saturation: function (s) {
    this.adjustments.sat = s || DEFAULT_AUTO;
    return this;
  },
  /**
   * hue of the image. supports 'auto' or a numeric value between -100 and 100
   * @param {string|number} h a Number between -100 and 100 or 'auto'
   * @returns {*} the operation
   */
  hue: function (h) {
    this.adjustments.hue = h || DEFAULT_AUTO;
    return this;
  },
  /**
   * vibrance of the image. supports 'auto' or a numeric value between -100 and 100
   * @param {string|number} v a Number between -100 and 100 or 'auto'
   * @returns {*} the operation
   */
  vibrance: function (v) {
    this.adjustments.vib = v || DEFAULT_AUTO;
    return this;
  },
  /**
   * Automatically adjusts the brightness, contrast, hue, vibrance and saturation
   * @param {boolean} [auto=true] enabled
   * @returns {*} the operation
   */
  autoAdjust: function (auto) {
    if (auto !== undefined && auto === false) {
      delete this.adjustments.auto_adj;
      return this;
    }
    this.adjustments.auto_adj = null;
    return this;
  },
  /**
   * Indicates that this operation has adjustment parameters
   * @returns {boolean} true if adjustments are set
   */
  hasAdjustments: function () {
    for (var a in this.adjustments) {
      if (this.adjustments.hasOwnProperty(a)) {
        return true;
      }
    }
    return false;
  }
};
AdjustMixin.prototype.br = AdjustMixin.prototype.brightness;
AdjustMixin.prototype.con = AdjustMixin.prototype.contrast;
AdjustMixin.prototype.sat = AdjustMixin.prototype.saturation;
AdjustMixin.prototype.vib = AdjustMixin.prototype.vibrance;

/**
 * This provides methods used for filter APIs. It's not meant to
 * be used directly.
 * @mixin
 * @alias FilterMixin
 */
function FilterMixin(init) {
  this.filters = {};
  if (init !== undefined) {
    for (var f in init) {
      if (init.hasOwnProperty(f)) {
        this.filters[f] = init[f];
      }
    }
  }
}
FilterMixin.prototype = {
  /** @lends FilterMixin */
  /**
   * Applies an oil paint effect to the image.
   * @param {boolean} [oil=true] enabled
   * @returns {*} the operation
   */
  oil: function (oil) {
    if (oil !== undefined && oil === false) {
      delete this.filters.oil;
    } else {
      this.filters.oil = null;
    }
    return this;
  },
  /**
   * Negates the colors of the image.
   * @param {boolean} [neg=true] enabled
   * @returns {*} the operation
   */
  negative: function (neg) {
    if (neg !== undefined && neg === false) {
      delete this.filters.neg;
    } else {
      this.filters.neg = null;
    }
    return this;
  },
  /**
   * Applies a pixelate effect to the image.
   * @param {number} pixels the width of pixelation squares, in pixels
   * @returns {*} the operation
   */
  pixelate: function (pixels) {
    this.filters.pix = pixels;
    return this;
  },
  /**
   * Applies a pixelate effect to faces in the image.
   * @param {number} pixels the width of pixelation squares, in pixels
   * @returns {*} the operation
   */
  pixelateFaces: function (pixels) {
    this.filters.pixfs = pixels;
    return this;
  },
  /**
   * Applies a blur effect to the image.
   * @param {number} blur percent to blur the image
   * @returns {*} the operation
   */
  blur: function (blur) {
    this.filters.blur = blur;
    return this;
  },
  /**
   * Sharpens the image using radius, amount & threshold parameters
   * @param {number} radius the unsharp mask radius. default value: 0.50
   * @param {number} amount the unsharp mask amount. default value: 0.20.
   * @param {number} amount the unsharp mask threshold. default value: 0.00.
   * @returns {*} the operation
   */
  unsharpMask: function (r, a, t) {
    if (a === undefined && t === undefined && (r === undefined || r === DEFAULT_AUTO)) {
      this.filters.us = DEFAULT_AUTO;
    } else {
      this.filters.us = r + "_" + a + "_" + t;
    }
    return this;
  },
  /**
   * Sharpens the image using radius
   * @param {number} radius sharpening mask radius, 0 to image size
   * @returns {*} the operation
   */
  sharpen: function (radius) {
    this.filters.shrp = radius;
    return this;
  },
  /**
   * Indicates that this operation has filter parameters
   * @returns {boolean} true if filters are set
   */
  hasFilters: function () {
    for (var a in this.filters) {
      if (this.filters.hasOwnProperty(a)) {
        return true;
      }
    }
    return false;
  }
};

FilterMixin.prototype.pix = FilterMixin.prototype.pixelate;
FilterMixin.prototype.neg = FilterMixin.prototype.negative;
FilterMixin.prototype.pixfs = FilterMixin.prototype.pixelateFaces;
FilterMixin.prototype.us = FilterMixin.prototype.unsharpMask;

function OperationMixin(endpoint, imageId, version, opName, init, filters, adjustments) {
  this.endpoint = endpoint;
  this.imageId = imageId;
  this.version = version;
  this.opName = opName;
  AdjustMixin.call(this, adjustments);
  FilterMixin.call(this, filters);
  this.operations = {};
  if (init !== undefined) {
    for (var p in init) {
      if (init.hasOwnProperty(p)) {
        this.operations[p] = init[p];
      }
    }
  }
}

extend(OperationMixin.prototype, AdjustMixin.prototype);
extend(OperationMixin.prototype, FilterMixin.prototype);

function outputParams(params) {
  var out = "";
  for (var a in params) {
    if (params.hasOwnProperty(a)) {
      if (out.length > 0) {
        out += ",";
      }
      out += (params[a] !== null) ? (a + "_" + params[a]) : a;
    }
  }
  return out;
}
/**
 * Sets the name of the image to return
 * @param {string} name the name of the image
 * @returns {*} the operation
 */
OperationMixin.prototype.name = function(name) {
  this.imageName = name;
  return this;
};

/**
 * Returns the URL of the configured image
 * @returns {String} the URL of the image
 */
OperationMixin.prototype.toUrl = function () {
  var out = this.endpoint + "/" + this.imageId + "/" + this.version + "/" + this.opName + "/";

  var params = outputParams(this.operations);
  if (this.hasAdjustments()) {
    if (params.length > 0) {
      params += ",";
    }
    params += outputParams(this.adjustments);
  }
  if (this.hasFilters()) {
    if (params.length > 0) {
      params += ",";
    }
    params += outputParams(this.filters);
  }
  return out + params + "/" + this.imageName;
};

/**
 * This provides methods used for operation APIs. It's not meant to be used directly.
 * @mixin
 * @alias WidthHeightQualityMixin
 */
function WidthHeightQualityMixin() {
}
WidthHeightQualityMixin.prototype = {
  /**
   * The width constraint
   * @param {Number} w a number greater than 0
   * @returns {*} the operation
   */
  width: function (w) {
    this.operations.w = w;
    return this;
  },
  /**
   * The height constraint
   * @param {Number} h a number greater than 0
   * @returns {*} the operation
   */
  height: function (h) {
    this.operations.h = h;
    return this;
  },
  /**
   * The shorthand to set width and height
   * @param {Number} w a number greater than 0
   * @param {Number} h a number greater than 0
   * @returns {*} the operation
   */
  size: function (w, h, q) {
    this.width(w);
    this.height(h);
    if (q !== undefined) {
      this.quality(q);
    }
    return this;
  },
  /**
   * The quality constraint, if the image is a jpg
   * @param {Number} [q=75] a number from 0 to 100
   * @returns {*} the operation
   */
  quality: function (q) {
    this.operations.q = q || 75;
    return this;
  },
  /**
   * An option for JPEGs only.
   * Applies baseline encoding on the image, instead of progressive encoding.
   * @param {boolean} [bl=true] enable progressive encoding
   * @returns {*} the operation
   */
  bl : function(bl) {
    if (bl !== undefined && bl === false) {
      delete this.operations.bl;
    } else {
      this.operations.bl = null;
    }
    return this;
  }
 };
//add shorthand properties
WidthHeightQualityMixin.prototype.w = WidthHeightQualityMixin.prototype.width;
WidthHeightQualityMixin.prototype.h = WidthHeightQualityMixin.prototype.height;
WidthHeightQualityMixin.prototype.q = WidthHeightQualityMixin.prototype.quality;

/**
 * This provides methods used for operation APIs. It's not meant to be used directly.
 * @mixin
 * @alias ResizeFillMixin
 */
function ResizeFillMixin() {
}

/**
 * The resize filter
 * @param {number} rf the filter to use, from {@link Defaults#ResizeFilters}
 * @returns {*} the operation
 *
 */
ResizeFillMixin.prototype.resizeFill = function (rf) {
  this.operations.rf = rf;
  return this;
};

ResizeFillMixin.prototype.rf = ResizeFillMixin.prototype.resizeFill;

/**
 * This provides methods used for operation APIs. It's not meant to be used directly.
 * @mixin
 * @alias AlignmentMixin
 */
function AlignmentMixin() {
}

AlignmentMixin.prototype = {
  /**
   * Sets the alignment value for this operation {@link Defaults#Alignment}
   * @param {Alignments} a the alignment value
   * @returns {*} the operation
   */
  alignment: function (a) {
    this.operations.a = a;
    return this;
  }
};
AlignmentMixin.prototype.a = AlignmentMixin.prototype.alignment;

/**
 * Resizes the image canvas, filling the width and height boundaries and crops any excess image data.
 * The resulting image will match the width and height constraints without scaling the image.
 * @constructor Canvas
 * @mixes BaseMixin
 * @mixes AdjustMixin
 * @mixes FilterMixin
 * @mixes WidthHeightQualityMixin
 */
function Canvas(endpoint, imageId, version, data, filter, adjust) {
  OperationMixin.call(this, endpoint, imageId, version, "canvas", data, filter, adjust);
}

extend(Canvas.prototype, OperationMixin.prototype);
extend(Canvas.prototype, WidthHeightQualityMixin.prototype);
extend(Canvas.prototype, AlignmentMixin.prototype);

/**
 * The background color, in case the canvas size is larger than the image itself.
 * @param {string} c an RGB value, of form rrggbb
 * @returns {*} the operation
 */
Canvas.prototype.c = function (c) {
  this.operations.c = c;
  return this;
};

/**
 * Create an image with the exact given width and height while retaining original proportions.
 * Use only part of the image that fills the given dimensions. Only part of the original image
 * might be visible if the required proportions are different than the original ones.
 * @constructor Fill
 * @mixes BaseMixin
 * @mixes AdjustMixin
 * @mixes FilterMixin
 * @mixes AlignmentMixin
 * @mixes WidthHeightQualityMixin
 * @mixes ResizeFillMixin
 */
function Fill(endpoint, imageId, version, data, filter, adjust) {
  OperationMixin.call(this, endpoint, imageId, version, "fill", data, filter, adjust);
}
extend(Fill.prototype, OperationMixin.prototype);
extend(Fill.prototype, WidthHeightQualityMixin.prototype);
extend(Fill.prototype, AlignmentMixin.prototype);
extend(Fill.prototype, ResizeFillMixin.prototype);

/**
 * Resizes the image to fit to the specified width and height while retaining original image proportion.
 * The entire image will be visible but not necessarily fill the area specified by the width and height.
 * @constructor Fit
 * @mixes BaseMixin
 * @mixes AdjustMixin
 * @mixes FilterMixin
 * @mixes WidthHeightQualityMixin
 * @mixes ResizeFillMixin
 */
function Fit(endpoint, imageId, version, data, filter, adjust) {
  OperationMixin.call(this, endpoint, imageId, version, "fit", data, filter, adjust);
}
extend(Fit.prototype, OperationMixin.prototype);
extend(Fit.prototype, WidthHeightQualityMixin.prototype);
extend(Fit.prototype, ResizeFillMixin.prototype);

/**
 * Crops the image based on the supplied coordinates, starting at the x, y pixel
 * coordinates along with the width and height parameters.
 * @constructor Crop
 * @mixes BaseMixin
 * @mixes AdjustMixin
 * @mixes FilterMixin
 * @mixes WidthHeightQualityMixin
 */
function Crop(endpoint, imageId, version, data, filter, adjust) {
  OperationMixin.call(this, endpoint, imageId, version, "crop", data, filter, adjust);
}
extend(Crop.prototype, OperationMixin.prototype);
extend(Crop.prototype, WidthHeightQualityMixin.prototype);

/**
 * The x value of the crop
 * @param {number} x the x value
 * @returns {*} the operation
 */
Crop.prototype.x = function (x) {
  this.operations.x = x;
  return this;
};

/**
 * The y value of the crop
 * @param {number} y the y value
 * @returns {*} the operation
 */
Crop.prototype.y = function (y) {
  this.operations.y = y;
  return this;
};

/**
 * A shorthand for setting the x and y coordinates for this crop
 * @param {number} x the x value
 * @param {number} y the y value
 * @returns {Crop}
 */
Crop.prototype.coords = function (x, y) {
  this.x(x);
  this.y(y);
  return this;
};

/**
 * Enables users to apply watermark such as copyright notice in order to protect their images.
 * @constructor Watermark
 * @mixes BaseMixin
 * @mixes AdjustMixin
 * @mixes FilterMixin
 * @mixes AlignmentMixin
 */
function Watermark(endpoint, imageId, version, data, filter, adjust) {
  OperationMixin.call(this, endpoint, imageId, version, "wm", data, filter, adjust);
}

extend(Watermark.prototype, OperationMixin.prototype);
extend(Watermark.prototype, AlignmentMixin.prototype);

/**
 * The watermark image id. Please notice that the wmid format is similar to the file_id format used earlier in the URL. Must be url-plus encoded.
 * @param {String} wmid a string identifier
 * @returns {Watermark}
 */
Watermark.prototype.wmid = function (wmid) {
  this.operations.wmid = wmid;
  return this;
};
/**
 * The Watermark opacity.
 * @param {number} o a number between 0 and 100
 * @returns {Watermark}
 */
Watermark.prototype.opacity = function (o) {
  this.operations.op = o;
  return this;
};
Watermark.prototype.op = Watermark.prototype.opacity;
/**
 * Watermark horizontal scaling as percents of the requested image width
 * @param {number} o a percent between 0 and 100
 * @returns {Watermark}
 */
Watermark.prototype.scale = function (s) {
  this.operations.scl = s;
  return this;
};
Watermark.prototype.scl = Watermark.prototype.scale;

function fromUrl(url) {
  var data = parser.parse(url);
  var target = null, filter = null, adjust = null;
  if (data.api) {
    if (data.api.hasOwnProperty('fit')) {
      target = new Fit(data.endpoint, data.imageId, data.version, data.api.fit, data.api.filter, data.api.adjust).name(data.imageName);
    } else if (data.api.hasOwnProperty('canvas')) {
      target = new Canvas(data.endpoint, data.imageId, data.version, data.api.canvas, data.api.filter, data.api.adjust).name(data.imageName);
    } else if (data.api.hasOwnProperty('fill')) {
      target = new Fill(data.endpoint, data.imageId, data.version, data.api.fill, data.api.filter, data.api.adjust).name(data.imageName);
    } else if (data.api.hasOwnProperty('wm')) {
      target = new Watermark(data.endpoint, data.imageId, data.version, data.api.wm, data.api.filter, data.api.adjust).name(data.imageName);
    } else if (data.api.hasOwnProperty('crop')) {
      target = new Crop(data.endpoint, data.imageId, data.version, data.api.crop, data.api.filter, data.api.adjust).name(data.imageName);
    }
    if (target === null) {
      return filter !== null ? filter : adjust;
    }
  }
  return target;
}

/**
 * a WixImage is a configurable object that supports all the operations, filters and adjustments supported by Wix Media Services
 * @param {String} baseUrl the base URL where the image is hosted
 * @param {String} imageId the id of the image to manipulate
 * @constructor WixImage
 */
function WixImage(baseUrl, imageId, version) {
  this.imageId = imageId;
  this.endpoint = baseUrl;
  this.version = version || "v1";
}

WixImage.prototype = {
  /** @lends WixImage */

  /**
   * Configures this image using the 'canvas' operation.
   * @param {Object} [data=null] optional configuration data for this operation
   * @param {Object} [filter=null] optional configuration data for image adjustments
   * @param {Object} [adjust=null] optional configuration data for image filters
   * @returns {Canvas}
   * @memberOf WixImage#
   * @method
   */
  canvas: function (data, filter, adjust) {
    return new Canvas(this.endpoint, this.imageId, this.version, data, filter, adjust);
  },
  /**
   * Configures this image using the 'fill' operation.
   * @param {Object} [data=null] optional configuration data for this operation
   * @param {Object} [filter=null] optional configuration data for image adjustments
   * @param {Object} [adjust=null] optional configuration data for image filters
   * @returns {Fill}
   * @memberOf WixImage#
   * @method
   */
  fill: function (data, filter, adjust) {
    return new Fill(this.endpoint, this.imageId, this.version, data, filter, adjust);
  },
  /**
   * Configures this image using the 'fit' operation.
   * @param {Object} [data=null] optional configuration data for this operation
   * @param {Object} [filter=null] optional configuration data for image adjustments
   * @param {Object} [adjust=null] optional configuration data for image filters
   * @returns {Fit}
   * @memberOf WixImage#
   * @method
   */
  fit: function (data, filter, adjust) {
    return new Fit(this.endpoint, this.imageId, this.version, data, filter, adjust);
  },
  /**
   * Configures this image using the 'crop' operation.
   * @param {Object} [data=null] optional configuration data for this operation
   * @param {Object} [filter=null] optional configuration data for image adjustments
   * @param {Object} [adjust=null] optional configuration data for image filters
   * @returns {Crop}
   * @memberOf WixImage#
   * @method
   */
  crop: function (data, filter, adjust) {
    return new Crop(this.endpoint, this.imageId, this.version, data, filter, adjust);
  },
  /**
   * Configures this image using the 'wm' operation.
   * @param {Object} [data=null] optional configuration data for this operation
   * @param {Object} [filter=null] optional configuration data for image adjustments
   * @param {Object} [adjust=null] optional configuration data for image filters
   * @returns {Watermark}
   * @memberOf WixImage#
   * @method
   */
  wm: function (data, filter, adjust) {
    return new Watermark(this.endpoint, this.imageId, this.version, data, filter, adjust);
  }
};

/**
 * Constants for use with image operations
 * @class
 */
function Defaults() {
  /**
   * Alignments for use with image manipulations
   * @readonly
   * @enum
   */
  this.Alignment = {
    /**
     * Focuses or aligns on the center of the image, both vertical and horizontal center.
     * @constant
     */
    CENTER: "c",
    /**
     * Focuses or aligns on the top of the image, horizontal center.
     */
    TOP: "t",
    /**
     * Focuses or aligns on top left side of the image.
     */
    TOP_LEFT: "tl",
    /**
     * Focuses or aligns on top right side of the image.
     * @constant
     */
    TOP_RIGHT: "tr",
    /**
     * Focuses or aligns on the bottom of the image, horizontal center.
     */
    BOTTOM: "b",
    /**
     * Focuses or aligns on the bottom left side of the image.
     */
    BOTTOM_LEFT: "bl",
    /**
     * Focuses or aligns on the bottom right side of the image.
     */
    BOTTOM_RIGHT: "br",
    /**
     * Focuses or aligns on the left side of the image, horizontal center.
     */
    LEFT: "l",
    /**
     * Focuses or aligns on the right side of the image, horizontal center.
     */
    RIGHT: "r",
    /**
     * Focus on a face on the image. Detects a face in the picture and centers on it. When multiple faces are detected in the picture, the focus will be on one of them.
     */
    FACE_RECOGNITION: "f",
    /**
     * Focus on all faces in the image. Detects multiple faces and centers on them. Will do a best effort to have all the faces in the new image, depending on the size of the new canvas.     * @constant
     */
    ALL_FACES: "fs"
  };
  /**
   * Resize filters for use with resize operations
   * @readonly
   * @enum
   */
  this.ResizeFilters = {
    POINT:1,
    BOX:2,
    TRIANGLE:3,
    HERMITE:4,
    HANNING:5,
    HAMMING:6,
    BLACKMAN:7,
    GAUSSIAN:8,
    QUADRATIC:9,
    CUBIC:10,
    CATROM:11,
    MITCHELL:12,
    JINC:13,
    SINC:14,
    SINC_FAST:15,
    KAISER:16,
    WELCH:17,
    PARZEN:18,
    BOHMAN:19,
    BARTLETT:20,
    LAGRANGE:21,
    LANCZOS:22,
    LANCZOS_SHARP:23,
    LANCZOS2:24,
    LANCZOS2_SHARP:25,
    ROBIDOUX:26,
    ROBIDOUX_SHARP:27,
    COSINE:28
  };
  /**
   * Anchors for use with canvas
   * @borrows Defaults#Alignment as Defaults#Anchor
   */
  this.Anchor = this.Alignment;

  /**
   * The default quality for jpgs
   * @type {number}
   * @readonly
   * @member
   */
  this.QUALITY = DEFAULT_QUALITY;

  /**
   * The default unsharpen radius
   * @type {number}
   * @readonly
   * @member
   */
  this.US_RADIUS = DEFAULT_US_RADIUS;

  /**
   * The default unsharpen threshold
   * @type {number}
   * @readonly
   * @member
   */
  this.US_AMOUNT = DEFAULT_US_AMOUNT;

  /**
   * The default unsharpen amount
   * @type {number}
   * @readonly
   * @member
   */
  this.US_THRESHOLD = DEFAULT_US_THRESHOLD;

  /**
   * Default value 'auto'
   * @type {string}
   */
  this.AUTO = DEFAULT_AUTO;
}

module.exports = {
  WixImage: WixImage,
  Defaults: new Defaults(),
  fromUrl: fromUrl
};
