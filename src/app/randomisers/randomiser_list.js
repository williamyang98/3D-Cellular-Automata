import { 
    Randomiser_Visitor, Randomiser,
    Copy_Randomiser_Params_From_Other_Randomiser,
    Randomiser_Radius_Absolute, Randomiser_Radius_Relative 
} from "./randomisers.js";

import { Get_Volume_Params_From_Randomiser } from './get_volume_params.js';

const Randomiser_List_Types = {
    RADIUS_ABSOLUTE: 0,
    RADIUS_RELATIVE: 1
}

class Get_Randomiser_List_Type_From_Instance extends Randomiser_Visitor {
    constructor() {
        super();
    }

    /** @param {Randomiser_Radius_Absolute} randomiser */
    visit_radius_absolute = ({ randomiser }) => Randomiser_List_Types.RADIUS_ABSOLUTE;

    /** @param {Randomiser_Radius_Relative} randomiser */
    visit_radius_relative = ({ randomiser }) => Randomiser_List_Types.RADIUS_RELATIVE;
}

class Randomiser_List {
    constructor() {
        this.get_volume_params_visitor = new Get_Volume_Params_From_Randomiser();
        this.get_randomiser_list_type_visitor = new Get_Randomiser_List_Type_From_Instance();
        this.copy_randomiser_params_visitor = new Copy_Randomiser_Params_From_Other_Randomiser();

        this.selected_type = Randomiser_List_Types.RADIUS_RELATIVE;
        this.randomisers = {}
        this.randomisers[Randomiser_List_Types.RADIUS_ABSOLUTE] = new Randomiser_Radius_Absolute();
        this.randomisers[Randomiser_List_Types.RADIUS_RELATIVE] = new Randomiser_Radius_Relative();
    }

    /**
     * @param {Randomiser_List.Types} type 
     * @returns {Randomiser}
     */
    get_randomiser = (type) => {
        if (type === undefined) {
            type = this.selected_type;
        }
        if (!(type in this.randomisers)) {
            throw Error(`Invalid randomiser id in list: ${type}`);
        }
        return this.randomisers[type];
    }

    /**
     * @param {Object{x,y,z}} absolute_size
     * @returns {Randomise_Volume_Params}
     */
    get_volume_params = (absolute_size) => {
        let randomiser = this.get_randomiser();
        return randomiser.accept_visitor(this.get_volume_params_visitor, { absolute_size });
    }

    /**
     * Update internal randomiser of same type from externally provided randomiser
     * @param {Randomiser} randomiser
     */
    copy_randomiser = (other_randomiser) => {
        let type = other_randomiser.accept_visitor(this.get_randomiser_list_type_visitor);
        let randomiser  = this.get_randomiser(type);

        this.selected_type = type;
        randomiser.accept_visitor(this.copy_randomiser_params_visitor, { other: other_randomiser });
    }
}

export { Randomiser_List, Randomiser_List_Types };