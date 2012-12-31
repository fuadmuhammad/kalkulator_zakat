use Rack::Static, 
  :urls => ["/kalkulator.js","/accounting.min.js"],
  :root => "."

run lambda { |env|
  [
    200, 
    {
      'Content-Type'  => 'text/html', 
      'Cache-Control' => 'public, max-age=86400' 
    },
    File.open('kalkulatorzakat.html', File::RDONLY)
  ]
}
