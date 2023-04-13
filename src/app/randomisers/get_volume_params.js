import { Randomise_Volume_Params } from "../simulation/randomise_volume.js";
import { Randomiser_Visitor } from './randomisers.js';

class Get_Volume_Params_From_Randomiser extends Randomiser_Visitor {
    constructor() {
        super();
    }

    /**
     * @param {Randomiser_Radius_Relative} randomiser 
     * @param {Object{x,y,z}} absolute_size
     * @returns {Randomise_Volume_Params}
     */
    visit_radius_relative = ({ randomiser, absolute_size }) => {
        let params = new Randomise_Volume_Params();
        params.density = randomiser.density;
        params.region.x = randomiser.radius;
        params.region.y = randomiser.radius;
        params.region.z = randomiser.radius;
        return params;
    }

    /**
     * @param {Randomiser_Radius_Absolute} randomiser 
     * @param {Object{x,y,z}} absolute_size
     * @returns {Randomise_Volume_Params}
     */
    visit_radius_absolute = ({ randomiser, absolute_size }) => {
        let params = new Randomise_Volume_Params();
        let diameter = randomiser.radius*2;
        params.density = randomiser.density;
        params.region.x = Math.min(diameter / absolute_size.x, 1.0);
        params.region.y = Math.min(diameter / absolute_size.y, 1.0);
        params.region.z = Math.min(diameter / absolute_size.z, 1.0);
        return params;
    }
}

export { Get_Volume_Params_From_Randomiser };