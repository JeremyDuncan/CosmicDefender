Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Set the root route
  root to: 'home#index'
  # Defines the root path route ("/")
  # root "articles#index"
  #
  resources :players do
    member do
      get 'high_scores'
      get 'levels'
      get 'power_ups'
    end
  end

  resources :levels do
    member do
      get 'players'
    end
  end

  resources :high_scores
  resources :power_ups do
    member do
      get 'player'
    end
  end

end
