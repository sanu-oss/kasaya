# How macros work

*TODO: expand this stub*

### You define a macro with `how to`.

```
# selects an account from the current account dropdown
how to select $account as current account
  click "Account" near "Home"
  click $account
  # TODO: check if...
end
```

### You use it in a runnable block or another macro.

```
# define a test case
how to check if switching accounts clears to total
  select "Foo" as current account
  read "Your account total is ${total}"
  check if $total is "0.00" # foo is an inactive account
end

# run tests
start
  check if switching accounts clears to total
end
```

### You can also import macros

```
in this context
  select $account as current account is from "./accountUtils.kasaya"
end
```
