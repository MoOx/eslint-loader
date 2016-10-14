var test = require("tape")
var webpack = require("webpack")
var assign = require("object-assign")
var conf = require("./utils/conf")
var fs = require("fs")

/* eslint-disable no-console */
test("eslint-loader can use eslint formatter", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }

    console.log("### Here is a example of the default formatter")
    console.log(
      "# " +
      stats.compilation.errors[0].message
        .split("\n")
        .join("\n# ")
    )
    t.ok(stats.compilation.errors[0].message, "webpack have some output")
    t.end()
  })
})

test("eslint-loader can use custom formatter", function(t) {
  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
      eslint: assign({}, conf.eslint, {
        formatter: require("eslint-friendly-formatter"),
      }),
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }

    console.log("### Here is a example of another formatter")
    console.log(
      "# " +
      stats.compilation.errors[0].message
        .split("\n")
        .join("\n# ")
    )
    t.ok(
      stats.compilation.errors[0].message,
      "webpack have some output with custom formatters"
    )
    t.end()
  })
})

test("eslint-loader cant be configured to write eslint results to a file",
function(t) {

  var outputFilename = "outputReport.txt"

  webpack(assign({},
    conf,
    {
      entry: "./test/fixtures/error.js",
      eslint: assign({}, conf.eslint, {
        formatter: require("eslint/lib/formatters/checkstyle"),
        outputReport: {
          filePath: outputFilename,
        },
      }),
    }
  ),
  function(err, stats) {
    if (err) {
      throw err
    }

    console.log("### Here is a the outpur of the formatter")
    console.log(
      "# " +
      stats.compilation.errors[0].message
        .split("\n")
        .join("\n# ")
    )

    fs.readFile(conf.output.path + outputFilename,
      "utf8", function(err, contents) {
        if (err) {
          t.fail("Expected file to have been created")
        }
        else {
          t.pass("File has been created")

          t.equal(stats.compilation.errors[0].message, contents,
            "File Contents should equal output")
        }

      })

    t.end()
  })
})
