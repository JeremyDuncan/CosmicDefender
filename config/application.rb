require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CosmicDefender
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0
    config.hosts << "cosmicdefender.jeremyduncan.synology.me"
    config.hosts << "cosmicdefender.jeremyd.net"
    # Allow any subdomain of jeremyd.net
    config.hosts << /\.jeremyd\.net\z/
    config.assets.paths << Rails.root.join("app", "assets", "audio")

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
