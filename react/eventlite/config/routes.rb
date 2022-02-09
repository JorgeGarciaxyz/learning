Rails.application.routes.draw do
  root "events#index"

  resources :events, only: [:index, :create]

  namespace :api do
    namespace :v1, defaults: { format: :json } do
      resources :events, only: [:index, :create]
    end
  end
end
