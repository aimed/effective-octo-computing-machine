package policies.authz

default allow = false

# Allow a customer to do anything with their own purchase orders
allow = true {
    customerOwnsResource
    customerIsAllowedAction
}

# Allow a customer to do X to another customers purchase orders
allow = true {
    customerHasSupplierAccess
}

customerHasSupplierAccess {
    # TODO: Fetch this from a permission store
    permission = data.policies.permissions[input.subject.customerId][input.resource.customerId]

    permission.supplierId = input.resource.supplierId
    permission.actions[_] = input.action
}

customerOwnsResource {
    input.subject.customerId = input.resource.customerId
}

customerIsAllowedAction {
    actions[_] = input.action
}

actions := {
    "list",
    "upload"
}

# allow = true {
#     # http.send({ "method": "get", "url": "https://big-mule-9.localtunnel.me" }, output)
# }
