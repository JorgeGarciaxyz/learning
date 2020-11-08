# Rails setup

This is my current setup, this would evolve over time.

1. Init rails project without minitest and with postgres
2. Create the docker-compose, there's an example on this directory
  - Add instructions on the readme
3. Setup secrets strategy (as you want)
4. Install and setup Rubocop
  - Rubocop rails https://github.com/rubocop-hq/rubocop-rails
  - Rubocop rspec https://github.com/rubocop-hq/rubocop-rspec
5. Install pry-rails https://github.com/rweng/pry-rails
6. Setup rspec
  - rspec rails https://github.com/rspec/rspec-rails
  - factory bot https://github.com/thoughtbot/factory_bot_rails
  - faker https://github.com/faker-ruby/faker
  - shoulda matchers https://github.com/thoughtbot/shoulda-matchers
  - database_cleaner https://github.com/DatabaseCleaner/database_cleaner
  - simplecov https://github.com/simplecov-ruby/simplecov
7. Setup brakeman https://github.com/presidentbeef/brakeman
8. Setup traceroute https://github.com/amatsuda/traceroute
9. Git hooks to run the liner and/or pipeline
10. Setup the pipeline with the next runs:
  - rubocop
  - rspec
  - brakeman
  - traceroute
