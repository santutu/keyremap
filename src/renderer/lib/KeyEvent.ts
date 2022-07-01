export interface KeyEvent {
    keycode: number
    rawcode: number
    type: 'keydown' | 'keyup'
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    metaKey: boolean
}