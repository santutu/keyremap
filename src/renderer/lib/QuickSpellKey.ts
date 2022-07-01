export interface QuickSpellKey {
    keyCode: number;
    key: string;
    button: 'left' | 'right';
    returnKey: string | null;
    returnKeyCode : number | null
}