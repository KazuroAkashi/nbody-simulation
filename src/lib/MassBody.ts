export default class MassBody {
    constructor(
        posx: number,
        posy: number,
        readonly radius: number,
        private readonly mass: number
    ) {}
}
