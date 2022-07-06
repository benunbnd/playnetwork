import * as fs from 'fs';

class FileLevelProvider {
    constructor(path) {
        this.path = path;
    }

    save(id, data) {
        fs.mkdirSync(this.path, { recursive: true });
        fs.writeFileSync(`${this.path}/${id}.json`, data);
    }

    load(id) {
        try {
            return fs.readFileSync(`${this.path}/${id}.json`);
        } catch (e) {
            console.error(e);
        }
    }

    has(id) {
        return fs.existsSync(`${this.path}/${id}.json`);
    }
}

export default FileLevelProvider;
