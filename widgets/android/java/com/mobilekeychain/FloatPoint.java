package com.mobilekeychain;

public class FloatPoint {

    private float x,y;

    public FloatPoint(float x1, float y1) {
        x = x1;
        y = y1;
    }

    public float setX(float x1){
        return this.x = x1;
    };

    public float setY(float y1){
        return this.y = y1;
    };

    public float getX() { return x; };

    public float getY() { return y; };

    @Override
    public String toString() {
        return "FloatPoint{" +
                "x=" + x +
                ", y=" + y +
                '}';
    }
}
