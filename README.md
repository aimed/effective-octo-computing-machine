How to run

```sh
docker run -v $PWD:/policies -p 8181:8181 openpolicyagent/opa \
    run --server --log-level debug -b /policies -w
```

How to query

```text
POST http://localhost:8181/v1/data/policies/authz/allow

{
	"input": {
		"action": "list",
		"subject": {
	        "customerId": "C-1"
	    },
	    "resource": {
	        "customerId": "C-4",
	        "supplierId": "S-1"
    	}
	}
}
```

How to construct filter queries

```text
POST http://localhost:8181/v1/compile?pretty=true

{
  "query": "data.policies.authz.allow == true",
  "input": {
  	"action": "list",
    "subject": {
      "customerId": "C-1"
    }
  },
  "unknowns": [
    "input.resource"
  ]
}
```
