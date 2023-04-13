class LayeredFrameBuffer {
    constructor(gl, texture, z_offset, total_layers) {
        let frame_buffer = gl.createFramebuffer();
        let layers = Array(total_layers);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frame_buffer);
        for (let i = 0; i < total_layers; i++) {
            let layer = gl.COLOR_ATTACHMENT0+i;
            gl.framebufferTextureLayer(gl.FRAMEBUFFER, layer, texture, 0, z_offset+i);
            layers[i] = layer;
        }

        let res = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (res !== gl.FRAMEBUFFER_COMPLETE) {
            throw Error(`Incomplete layered framebuffer ${res}`);
        }

        this.gl_id = frame_buffer;
        this.gl_layers = layers;
        this.gl_texture = texture;

        this.total_layers = total_layers;
        this.z_offset = z_offset;
    }
}


/**
 * We want to swap between volume buffers when updating 
 * Therefore there is always a texture and framebuffer pair
 * When reading we use the texture directly
 * When writing we use the layered framebuffer 
 */
class Volume_Data {
    constructor(gl, x, y, z) {
        this.gl = gl;

        let size = { x, y, z };

        let texture = gl.createTexture(gl.TEXTURE_3D);
        gl.bindTexture(gl.TEXTURE_3D, texture);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
        // NOTE: We pass in data parameter as null since we don't want it on the CPU
        // NOTE: We are using two channels: [state, total_neighbours]
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 2);
        gl.pixelStorei(gl.PACK_ALIGNMENT, 2);
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RG8, x, y, z, 0, gl.RG, gl.UNSIGNED_BYTE, null);

        let frame_buffers = [];
        const max_layers = gl.getParameter(gl.MAX_COLOR_ATTACHMENTS);

        let curr_z = 0;
        while (curr_z !== size.z) { 
            let remaining_z = size.z - curr_z;
            let total_layers = Math.min(remaining_z, max_layers);
            let frame_buffer = new LayeredFrameBuffer(gl, texture, curr_z, total_layers);
            frame_buffers.push(frame_buffer);

            curr_z += total_layers;
        }

        this.size = size;
        this.texture = texture;
        this.frame_buffers = frame_buffers;
        this.max_layers = max_layers;
    }

    set_wrap = (is_wrap) => {
        let gl = this.gl;

        gl.bindTexture(gl.TEXTURE_3D, this.texture);

        if (is_wrap) {
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        }
    }
}

export { Volume_Data };