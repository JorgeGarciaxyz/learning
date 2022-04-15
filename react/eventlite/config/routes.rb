Rails.application.routes.draw do
  root "events#index"
  resources :events, only: [:index, :create]

  namespace :api do
    namespace :v1, defaults: { format: :json } do
      mount_devise_token_auth_for 'User', at: 'auth'

      resources :events, only: [:index, :create, :show, :update]
    end
  end
end
