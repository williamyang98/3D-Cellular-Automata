
// NOTE: We have multiple operands on multiple types so we are using the visitor pattern
class Randomiser_Visitor {
    /** @param {Randomiser_Radius_Absolute} randomiser */
    visit_radius_absolute = ({ randomiser }) => { 
        throw Error(`Visitor needs to implement radius_absolute: ${randomiser}`); 
    }

    /** @param {Randomiser_Radius_Relative} randomiser */
    visit_radius_relative = ({ randomiser }) => { 
        throw Error(`Visitor needs to implement radius_relative: ${randomiser}`); 
    }
}

class Randomiser {
    accept_visitor = (visitor, args) => { 
        throw Error(`Randomiser needs to implement this.accept_visitor: ${this}, ${visitor}, ${args}`); 
    }
}

class Randomiser_Radius_Relative extends Randomiser {
    constructor(density=1.0, radius=1.0) {
        super();
        this.density = density;
        this.radius = radius;
    }

    /**
     * @param {Randomiser_Visitor} visitor 
     * @param {Object} args 
     */
    accept_visitor = (visitor, args) => visitor.visit_radius_relative({ randomiser: this, ...args });
}

class Randomiser_Radius_Absolute extends Randomiser {
    constructor(density=1.0, radius=1) {
        super();
        this.density = density;
        this.radius = radius;
    }

    /**
     * @param {Randomiser_Visitor} visitor 
     * @param {Object} args 
     */
    accept_visitor = (visitor, args) => visitor.visit_radius_absolute({ randomiser: this, ...args });
}

class Copy_Randomiser_Params_From_Other_Randomiser extends Randomiser_Visitor {
    constructor() {
        super();
    }

    /** @param {Randomiser_Radius_Absolute} randomiser */
    /** @param {Randomiser_Radius_Absolute} other_randomiser */
    visit_radius_absolute = ({ randomiser, other }) => {
        randomiser.radius = other.radius;
        randomiser.density = other.density;
    }

    /** @param {Randomiser_Radius_Relative} randomiser */
    /** @param {Randomiser_Radius_Relative} other_randomiser */
    visit_radius_relative = ({ randomiser, other }) => {
        randomiser.radius = other.radius;
        randomiser.density = other.density;
    }
}

export { 
    Randomiser_Visitor,
    Randomiser_Radius_Absolute,
    Randomiser_Radius_Relative,
    Copy_Randomiser_Params_From_Other_Randomiser,
};