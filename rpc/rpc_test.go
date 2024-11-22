package rpc_test

import (
	"fmt"
	"lsp/rpc"
	"testing"
)

type EncodingExample struct {
	Testing bool
}

func TestEncodeMessage(t *testing.T) {
	expected := "Content-Length: 16\r\n\r\n{\"Testing\":true}"
	actual := rpc.EncodeMessage(EncodingExample{Testing: true})

	if expected != actual {
		t.Fatalf("Expected: %s, Actual: %s", expected, actual)
	}
}

func TestDecodeMessage(t *testing.T) {
	incomingMessages := "Content-Length: 15\r\n\r\n{\"Method\":\"hi\"}"
	method, contentLength, err := rpc.DecodeMessage([]byte(incomingMessages))

	if err != nil {
		t.Fatal(err)
	}

	fmt.Printf("t: %d\n", contentLength)
	fmt.Printf("t: %s\n", method)

	if contentLength != 15 {
		t.Fatalf("Expected: 15 , Got: %d", contentLength)
	}

	if method != "hi" {
		t.Fatalf("Expected: 'hi' , Got: %s", method)
	}
}
