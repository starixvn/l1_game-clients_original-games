import { EventEmitter } from 'events';

class AnimationStateTransmitter extends EventEmitter {
    private static instance: AnimationStateTransmitter;

    private _isAnimationComplete: boolean = false;

    private constructor() {
        super();
    }

    public get isAnimationComplete(): boolean {
        return this._isAnimationComplete;
    }

    public setAnimationComplete(value: boolean): void {
        if (this._isAnimationComplete !== value) {
            this._isAnimationComplete = value;
            this.emit('animationComplete', value);
        }
    }

    public onAnimationComplete(callback: (isComplete: boolean) => void): void {
        this.on('animationComplete', callback);
    }

    public removeAnimationCompleteListener(callback: (isComplete: boolean) => void): void {
        this.removeListener('animationComplete', callback);
    }

    public static getInstance(): AnimationStateTransmitter {
        if (!AnimationStateTransmitter.instance) {
            AnimationStateTransmitter.instance = new AnimationStateTransmitter();
        }
        return AnimationStateTransmitter.instance;
    }
}

export const animationStateTransmitter = AnimationStateTransmitter.getInstance(); 