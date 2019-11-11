How to run

```sh
docker run -v $PWD:/example -p 8181:8181 openpolicyagent/opa \
    run --server --log-level debug -b /example -w
```

How to query

```text
POST http://localhost:8181/v1/data/example/authz/allow

{
	"input": {
		"subject": {
	        "customerId": "C-1"
	    },
	    "resource": {
	        "customerId": "C-1"
	    }
	}
}
```