let start = ['{', '[', '"'];
let end = ['}', ']', ',', '', '\n'];
let space = [' ', '\t'];
let numbers = ['-'];

for (let i = 0; i < 10; i++) {
    numbers.push(i.toString());
}

class JSONParser {
    pointer;
    string;
    constructor(string) {
        this.string = string;
        this.pointer = 0;
    }
    read() {
        return this.string.charAt(this.pointer++);
    }
    skip() {
        this.pointer++;
    }
    back() {
        this.pointer--;
    }
    parseElement() {
        let char;
        do {
            char = this.read();
            if (char == ':') return;
            if (end.includes(char)) {
                this.back();
                return;
            }
            if (this.isNull(char)) return null;
            if (this.isTrue(char)) return true;
            if (this.isFalse(char)) return false;
            if (char == '{') return this.parseObject(char);
            if (char == '[') return this.parseArray(char);
            if (numbers.includes(char)) return this.parseNumber(char);
            if (char == '"') return this.parseString(char);
        } while (char != '');
    }
    isNull(char) {
        let str = 'n';
        if (char == str) {
            for (let i = 0; i < 3; ++i) str += this.read();
            if (str == 'null') return true;
            throw new SyntaxError('Unexpected token ' + str + ' at position ' + this.pointer);
        }
        return false;
    }
    isTrue(char) {
        let str = 't';
        if (char == str) {
            for (let i = 0; i < 3; ++i) str += this.read();
            if (str == 'true') return true;
            throw new SyntaxError('Unexpected token ' + str + ' at position ' + this.pointer);
        }
        return false;
    }
    isFalse(char) {
        let str = 'f';
        if (char == str) {
            for (let i = 0; i < 4; ++i) str += this.read();
            if (str == 'false') return true;
            throw new SyntaxError('Unexpected token ' + str + ' at position ' + this.pointer);
        }
        return false;
    }
    parseObject(char) {
        if (char == '{') {
            let obj = {};
            do {
                let k = this.parseElement();
                if (k !== undefined) {
                    this.parseElement();
                    let v = this.parseElement();
                    if (v === undefined) throw new SyntaxError('Unexpected end at position ' + this.pointer)
                    obj[k] = v;
                }
            } while ((char = this.read()) != '}' && char != '');
            return obj;
        }
    }
    parseArray(char) {
        if (char == '[') {
            let arr = [];
            do {
                let e = this.parseElement();
                if (e !== undefined) arr.push(e);
            } while ((char = this.read()) != ']' && char != '');
            return arr;
        }
    }
    parseNumber(char) {
        if (numbers.includes(char)) {
            let num = '';
            do {
                num += char;
            } while (!end.includes(char = this.read()));
            this.back();
            if (num.includes('.') || num.includes('e')) return parseFloat(num);
            else return parseInt(num);
        }
    }
    parseString(char) {
        if (char == '"') {
            let string = '';
            while ((char = this.read()) != '"' && !end.includes(char)) {
                console.log(char, string);
                if (char == '\\') {
                    if (this.isEscape(char)) {
                        string += '.';
                        continue;
                    }
                }
                string += char;
            }
            return string;
        }
    }
    isEscape(char) {
        if (char == '\\') {
            char = this.read();
            if (char == '"' || char == '\\' || char == '/' || char == 'b' ||
                char == 'f' || char == 'n' || char == 't' || char == 'r' || char == 'u') {
                return true;
            } else {
                throw new SyntaxError("Invalid JSON input.");
            }
        } else {
            return false;
        }
    }
}