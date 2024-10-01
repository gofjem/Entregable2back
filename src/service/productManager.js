import fs from 'fs/promises'
import path from 'path'
import {v1,v3,v4,v5} from 'uuid'

const productsFilePath= path.resolve('data','productos.json')

export default class ProductManager {
    constructor(){
        this.productos=[]
        this.init()
    }
    async init(){
        try {
            const data = await fs.readFile(productsFilePath,'utf-8')
            this.productos=JSON.parse(data)
        } catch (error) {
            this.productos=[]
        }
    }

    generateId = () => crypto.randomUUID() //Generar IDs

    saveToFile(){
        fs.writeFile(productsFilePath,JSON.stringify(this.productos,null,2));
    }

    getAllProducts(limit){
        if(limit){
            return this.productos.slice(0,limit)
        }else{
            this.productos
        }
    }

    addProduct(product){
        const newProduct = {
             id: this.generateId(),
            ...product,
            status: true
        }
        this.productos.push(newProduct)
        this.saveToFile()

        return newProduct;
    }

    deleteProduct(id){
        const productIndex = this.productos.findIndex(product => product.id === id)
        if(productIndex === -1) return null;

        const deleteProduct = this.productos.splice(productIndex,1);
        this.saveToFile()

        return deleteProduct[0];
    }


}

