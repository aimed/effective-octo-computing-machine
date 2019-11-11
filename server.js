const express = require('express')
const app = express()
const fetch = require('node-fetch')
const basicAuth = require('express-basic-auth')

async function authzPurchaseOrder(req, resource) {
    if (!req.auth) {
        throw new Error()
    }

    const subject = {
        customerId: req.auth.user
    }

    const body = {input: { action: 'list', subject, resource }}
    
    console.log(body);
    
    return fetch('http://localhost:8181/v1/data/policies/authz/allow', {
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        if (!res.ok) {
            throw new Error('OPA Internal Error')
        }
        return res.json()
    }).then(res => {
        if (!res || !res.result === true) {
            throw new Error('Unauthorized')
        }
    })
}

const withAuthN = basicAuth({
    users: { 
        'C-1': '',
        'C-4': '',
    }
})

const purchaseOrders = [
    {
        _id: '1',
        customerId: 'C-4',
        supplierId: 'S-1'
    },
    {
        _id: '2',
        customerId: 'C-1',
        supplierId: 'XXX'
    },
    {
        _id: '3',
        customerId: 'C-3',
        supplierId: 'XXX'
    },
].reduce((all, po) => {
    all[po._id] = po
    return all
}, {})

async function filter() {}

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next)
        } catch (error) {
            console.error(error)
            res.status(500).send()
        }
    }
}

app.get('/', (req, res) => {
    res.send({})
})

app.get('/protected/:id', withAuthN, asyncHandler(async (req, res) => {
    // This could also be enforced using the same query filter
    const purchaseOrder = purchaseOrders[req.params.id]
    await authzPurchaseOrder(req, purchaseOrder)
    res.send(purchaseOrder)
}))

app.listen(8080)